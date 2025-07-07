import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositService } from 'src/app/core/services/deposit.service';
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
    private depositService: DepositService,
    private modalService: NgbModal) { }

  breadCrumbItems: Array<{}>;
  saveDepositSettings : FormGroup

  kycList: any[] = []
  total: number = 0;
  kycStatusList: any[] = ['Requested',  'Completed']
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;
  currUserId: string = '';


  currKYCStatus: string = 'Requested';

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Members' }, { label: 'KYC Requested', active: true }];
    this.searchFormGroup = new FormGroup({
      user_id: new FormControl(''),
      status: new FormControl('Completed'),
    });
    this.saveDepositSettings = new FormGroup({
      annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      interval: new FormControl('Monthly', [Validators.required]),
      penalty_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      amount: new FormControl('300', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(300)]),
      indirect_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      direct_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      franchise_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
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
        console.log('KYC Requests Response:', response);
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

  openCDSettingFn(settingModal: any, user: any) {
    this.modalService.open(settingModal, { size: 'lg', centered: true });
    this.currUserId = user.user;
  }

  setting() {
    if (this.saveDepositSettings.valid) {
      const payload = this.saveDepositSettings.value;
      payload.user = this.currUserId;
      this.depositService.compulsorySettings(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Deposit settings saved successfully.',
            confirmButtonText: 'OK'
          });
          this.getKycRequests();
          this.saveDepositSettings.reset();
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        console.error('Error saving deposit settings:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save deposit settings. Please try again later.',
          confirmButtonText: 'OK'
        });
      });
    } else {
      this.saveDepositSettings.markAllAsTouched();
    }
  }

}
