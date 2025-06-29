import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsersComponent implements OnInit {

  constructor(private userService: UserProfileService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  notificationFormGroup: FormGroup
  currStatus: string = 'Pending';
  currUserId: string = '';
  currKYCStatus: string = ''
  statusList: any[] = ['Pending', 'Active', 'Inactive', 'Blocked'];
  kycStatusList: any[] = ['Requested', 'Approved', 'Rejected']

  userList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'User List' }, { label: 'User', active: true }];
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
    this.getAllUsers();
  }

  search() {
    this.page = 1;
    this.getAllUsers();
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

    this.userService.getAllUsers(this.page, this.pageSize, queryParams).subscribe((res: any) => {
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

  changeStatusAccount(user: any, content: any) {
    this.openModal(content);
    this.currStatus = user.status;
    this.currUserId = user._id;
  }

  openKYCModal( user: any, content: any,) {
    this.openModal(content);
    this.currKYCStatus = user?.kyc[0]?.status;
    this.currUserId = user?._id;
  }

  changeKYCStatusAccount() {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${this.currKYCStatus} this account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${this.currKYCStatus} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.upsertKyc({status: this.currKYCStatus, user: this.currUserId}).subscribe((res: any) => {
          this.modalService.dismissAll();
          this.toast.success(`Account ${this.currStatus} Successfully`);
          this.getAllUsers();
        }, (err: any) => {
          console.error('Error changing user status:', err);
          this.modalService.dismissAll();
          this.toast.error(`Failed to ${this.currStatus} account`);
        });
      }
    });
  }

  changeStatus() {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${this.currStatus} this account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${this.currStatus} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeUserStatus(this.currUserId, this.currStatus).subscribe((res: any) => {
          this.modalService.dismissAll();
          this.toast.success(`Account ${this.currStatus} Successfully`);
          this.getAllUsers();
        }, (err: any) => {
          console.error('Error changing user status:', err);
          this.modalService.dismissAll();
          this.toast.error(`Failed to ${this.currStatus} account`);
        });
      }
    });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

}
