import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositService } from 'src/app/core/services/deposit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {

  constructor(private depositService: DepositService,
      private modalService: NgbModal,
    ) { }
    breadCrumbItems: Array<{}>;
  
    userList: any[] = []
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    searchFormGroup: FormGroup ;
    editSettingFormGroup: FormGroup;
    statusList: any[] = ['Requested', 'Confirmed', 'Closed']
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Deposit' }, { label: 'Recurring Deposit List', active: true }];
      this.searchFormGroup = new FormGroup({
        name:new FormControl(''),
        user_id: new FormControl(''),
        status: new FormControl('All'),  
      });
      this.editSettingFormGroup = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        duration: new FormControl('', [Validators.required]),
        maturity_amount: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
        // indirect_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
        // direct_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
      });
      this.getRecrruingDeposits();
    }

    calculateMaturityAmount() {
      const amount = this.editSettingFormGroup.get('amount')?.value;
      const duration = this.editSettingFormGroup.get('duration')?.value;
      const annualRate = this.editSettingFormGroup.get('annual_rate')?.value;

      console.log('Calculating maturity amount with:', { amount, duration, annualRate });

      if (amount && duration && annualRate) {
        const simpleInterest = (amount * annualRate * duration) / 100;
        const maturityAmount = amount + simpleInterest;
        this.editSettingFormGroup.patchValue({ maturity_amount: maturityAmount.toFixed(2) });
      } else {
        this.editSettingFormGroup.patchValue({ maturity_amount: '' });
      }
    }
  
    getRecrruingDeposits() {
  
      const searchParams = this.searchFormGroup.value;
      const queryParamArray = [];
  
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== null && searchParams[key] !== '') {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
        }
      });
  
      const queryParams = queryParamArray.join('&');
  
      this.depositService.getAllFixedDeposits(this.page, this.pageSize,queryParams).subscribe((res: any) => {
        if (res.status) {
          this.userList = res.data.deposits;
          console.log(this.userList);
          this.total = res.data.total;
        }
      }, err => {
        console.error(err);
      });
    }
    
    reset() {
      this.searchFormGroup.reset();
      this.page = 1;
      this.getRecrruingDeposits();
    }
  
    findPageShowing(): number {
      return Math.min(this.page * this.pageSize, this.total)
    }
  
    pageChange(page: number) {
      this.page = page;
      this.getRecrruingDeposits();
    }
  
    openRDSettingFn(settingModal: any, user: any) {
      this.editSettingFormGroup.patchValue(user)
      this.modalService.open(settingModal, { size: 'lg', centered: true });
    }
  
     editSetting() {
      if (this.editSettingFormGroup.valid) {
        const payload = this.editSettingFormGroup.value;
        payload.maturity_amount  = (payload.amount + ((payload.amount * payload.annual_rate * payload.duration) / 100)).toFixed(2);
        payload.status = 'Confirmed';
        console.log('Payload for editing deposit setting:', payload);
        this.depositService.editFDepositSettings(this.editSettingFormGroup.value).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Deposit setting updated successfully',
              confirmButtonText: 'OK'
            });
            this.getRecrruingDeposits();
            this.modalService.dismissAll();
          },
          error: (err) => {
            console.error('Error updating deposit setting:', err);
          }
        });
      } else {
        console.error('Edit setting form is invalid:', this.editSettingFormGroup.errors);
      }
    }

  

}
