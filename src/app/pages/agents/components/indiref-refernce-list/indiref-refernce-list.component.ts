import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-indiref-refernce-list',
  templateUrl: './indiref-refernce-list.component.html',
  styleUrls: ['./indiref-refernce-list.component.scss']
})
export class IndirefRefernceListComponent implements OnInit {

  constructor(private toast: ToastrService,
      private userService: UserProfileService,  
      private modalService: NgbModal,
      private route: ActivatedRoute
    ) {
      
     }
  
    breadCrumbItems: Array<{}>;
    notificationFormGroup: FormGroup
    currStatus: string = 'Pending';
    currUserId: string = '';
    currKYCStatus: string = ''
    currentUserId: string = '';
    statusList: any[] = ['Pending', 'Active', 'Inactive', 'Blocked'];
    kycStatusList: any[] = ['Requested', 'Approved', 'Rejected']
  
    userList: any[] = []
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    totalIndirectCommission: number = 0;
    searchFormGroup: FormGroup ;
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Advisor List' }, { label: 'User', url: '/agents'}, {label: 'InDirect Reference', active: true }];
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
      
      this.route.params.subscribe(params => {
        this.currentUserId = params['id'];
        console.log('Current User ID:', this.currentUserId);
        this.getInDiretRefUsers(this.currentUserId);
      });
    }
  
    search() {
      this.page = 1;
      this.getInDiretRefUsers();
    }
  
    reset() {
      this.page = 1
      this.searchFormGroup.reset()
      this.getInDiretRefUsers()
    }
  
    pageChange(page: number) {
      this.page = page;
      this.getInDiretRefUsers();
    }
  
    getInDiretRefUsers(userId: string = this.currentUserId) {
      const searchParams = this.searchFormGroup.value;
      const queryParamArray = [];
  
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== '') {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
        }
      });
  
      const queryParams = queryParamArray.join('&');
  
      this.userService.getInDirectRefUsers(this.page, this.pageSize, queryParams, userId).subscribe((res: any) => {
        if (res && res.data) {
          this.userList = res?.data?.users || [];
          this.totalIndirectCommission = res?.data?.commissionSummary?.totalIndirectCommission || 0;
          this.total = res?.data?.total || 0;
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
  
    addMember(user: any){
  
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

}
