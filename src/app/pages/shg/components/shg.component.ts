import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MastersService } from 'src/app/core/services/masters.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shg',
  templateUrl: './shg.component.html',
  styleUrls: ['./shg.component.scss']
})
export class ShgComponent implements OnInit {

  constructor(private userService: UserProfileService,
        private modalService: NgbModal,
        private masterService: MastersService,
        private toast: ToastrService
      ) { }
    breadCrumbItems: Array<{}>;
    notificationFormGroup: FormGroup
    currStatus: string = 'Pending';
    currUserId: string = '';
    currKYCStatus: string = ''
    statusList: any[] = ['Pending', 'Active', 'Inactive', 'Blocked'];
    kycStatusList: any[] = ['Approved', 'Rejected']
    approveSHGRequestFormGroup: FormGroup
  
    userList: any[] = []
    allAreas: any[] = [];
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    searchFormGroup: FormGroup ;
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'SHG List' }, { label: 'User', active: true }];
      this.notificationFormGroup = new FormGroup({
        title: new FormControl('', Validators.required),
        message: new FormControl('', Validators.required)
      });
      this.searchFormGroup = new FormGroup({
        name: new FormControl(''),
        user_id: new FormControl(''),
        account_number: new FormControl(''),
        status: new FormControl(''),
      });
      this.approveSHGRequestFormGroup = new FormGroup({
        shg_status: new FormControl('Requested', Validators.required),
        shg_loanAmount: new FormControl('', Validators.required),
        shg_areas: new FormControl('', Validators.required),
        shgPenalty: new FormControl('', Validators.required),
        shgDuration: new FormControl('', Validators.required),
      });
      this.getAllUsers();
    }
  
    search() {
      this.page = 1;
      this.getAllUsers();
    }

    getAreas(district: any) {
    if (!district) {
      this.allAreas = [];
      return;
    }

    if(!district?._id) {
      this.allAreas = [];
      return;
    }

    this.masterService.areas(district._id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.allAreas = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading areas:', error);
      }
    });
  }
  
    reset() {
      this.page = 1
      this.searchFormGroup.reset()
      this.getAllUsers()
    }
  
    pageChange(page: number) {
      this.page = page;
      this.getAllUsers();
    }
  
    getAllUsers() {
      const searchParams = this.searchFormGroup.value;
      const queryParamArray = [];
  
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== '') {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
        }
      });
  
      const queryParams = queryParamArray.join('&');
  
      this.userService.getSHGCoordinators(this.page, this.pageSize, queryParams).subscribe((res: any) => {
        if (res && res.data) {
          this.userList = res?.data?.users?.data || [];
          console.log('User List:', this.userList);
          this.total = res?.data?.users?.metadata[0]?.total || 0;
        } else {
          this.userList = [];
        }
      }, (err: any) => {
        console.error('Error fetching user list:', err);
        this.userList = [];
      });
    }
  
    isTimePassed(date: any) {
      if(!date) return false
      return (new Date().getTime() - new Date(date).getTime()) > 1 * 60 * 60 * 1000 ? true : false;
    }
  
    openModal(content: any) {
      this.modalService.open(content);
    }
  
    getAge(birthDate: string): number {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    }
  
  
    sendNotification(content: any, user: any) {
      this.currUserId = user._id;
      this.openModal(content);
    }
  
    sendMessage() {
      if (this.notificationFormGroup.invalid) {
        this.toast.error('Please fill all required fields');
        return;
      }
      const { title, message } = this.notificationFormGroup.value;
      this.userService.sendNotification(this.currUserId, title, message).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Notification sent successfully');
          this.modalService.dismissAll();
          this.notificationFormGroup.reset();
        } else {
          this.toast.error('Failed to send notification');
        }
      }, (err: any) => {
        console.error('Error sending notification:', err);
        this.toast.error('Failed to send notification');
      });
    }
  
    findPageShowing(): number {
      return Math.min(this.page * this.pageSize, this.total)
    }
  
    advisorModalFn(user: any, content: any) {
      if(user.shg_status !== 'Requested') {
        return;
      }
      this.currUserId = user._id;
      this.currStatus = user.advisor_status;
      console .log('Current User ID:', user);
      this.getAreas({_id: user.district});
      this.approveSHGRequestFormGroup.patchValue(user);
      this.openModal(content);
    }

      changeShgStatus() {

        if(this.approveSHGRequestFormGroup.invalid) {
          this.toast.error('Please fill all required fields correctly.');
          return;
        }

        const payload = this.approveSHGRequestFormGroup.value;
        payload._id = this.currUserId;
        payload.shg_status = payload.shg_status || 'Requested';
        payload.shg_loanAmount = payload.shg_loanAmount || 0;
        payload.shgPenalty = payload.shgPenalty || 0;
        payload.shgDuration = payload.shgDuration || 0;
        payload.shg_approved_date = new Date();
        payload.shg_areas = payload.shg_areas || [];


        Swal.fire({
          title: "Are you sure?",
          text: `You want to ${payload.shg_status} this SHG?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, ${payload.shg_status} it!`
        }).then((result) => {
          if (result.isConfirmed) {
            this.userService.updateProfile(payload).subscribe((res: any) => {
              this.modalService.dismissAll();
              Swal.fire({
                title: 'Success',
                text: `SHG status changed to ${payload.shg_status} successfully!`,
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.toast.success(`SHG status changed to ${payload.shg_status} Successfully`);
              this.getAllUsers();
            }, (err: any) => {
              console.error('Error changing SHG status:', err);
              this.modalService.dismissAll();
              this.toast.error(`Failed to change SHG status`);
            });
          }
        });
      }

}
