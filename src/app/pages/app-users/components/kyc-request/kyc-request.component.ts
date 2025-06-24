import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/shared/ui/toast/toast-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kyc-request',
  templateUrl: './kyc-request.component.html',
  styleUrls: ['./kyc-request.component.scss']
})
export class KycRequestComponent implements OnInit {

  constructor(private userService: UserProfileService, 
    private toast: ToastService,
    private modalService: NgbModal) { }

  breadCrumbItems: Array<{}>;

  kycList: any[] = []
  total: number = 0;
  kycStatusList: any[] = ['Requested', 'Approved', 'Rejected']
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;
  currUserId: string = '';
  

  currKYCStatus: string = 'Requested';

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Members' }, { label: 'KYC Requested', active: true }];
    this.searchFormGroup = new FormGroup({
      user_id: new FormControl(''),
      aadhar: new FormControl(''),
      pan: new FormControl(''),
    });
    this.getKycRequests();
  }

  getKycRequests() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');

    this.userService.getKycRequests(this.page, this.pageSize, queryParams).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.data) {
         this.kycList = response.data.kyc || [];
          this.total = response.data.total || 0;
        } 
      }
    });
  }

  search() {
    this.page = 1;
    this.getKycRequests();
  }

  reset() {
    this.searchFormGroup.reset();
    this.page = 1;
    this.getKycRequests();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getKycRequests();
  }

  openImage(imageUrl: string) {
    Swal.fire({
        imageUrl: imageUrl,
        imageWidth: 600,
        imageHeight: 600,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-no-padding'
        },
        padding: 0,
        backdrop: true
      });
  }

  openKYCModal(  content: any,user: any) {
    this.modalService.open(content);
    console.log(user);
    this.currKYCStatus = user?.status;
    this.currUserId = user?.user_details._id;
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
            this.toast.show(`KYC ${this.currKYCStatus} Successfully`,{classname: 'bg-success text-light',  delay: 5000});
            this.getKycRequests();
          }, (err: any) => {
            console.error('Error changing user status:', err);
            this.modalService.dismissAll();
            this.toast.show(`Failed to ${this.currKYCStatus} account`, {classname: 'bg-danger text-light', position:'top-center', delay: 5000});
          });
        }
      });
    }

}
