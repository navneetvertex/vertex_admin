import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositService } from 'src/app/core/services/deposit.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-compulsory-deposits',
  templateUrl: './compulsory-deposits.component.html',
  styleUrls: ['./compulsory-deposits.component.scss']
})
export class CompulsoryDepositsComponent implements OnInit {

  constructor(private depositService: DepositService,
      private modalService: NgbModal,
      private settingsService: SettingsService
    ) { }
    breadCrumbItems: Array<{}>;
  
    userList: any[] = []
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    searchFormGroup: FormGroup ;
    rd_rate: number = 0;
    editDepositSettings: FormGroup;
    statusList: any[] = ['Requested', 'Confirmed', 'Closed']
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Deposit' }, { label: 'Compulsory Deposit List', active: true }];
      this.searchFormGroup = new FormGroup({
        name:new FormControl(''),
        user_id: new FormControl(''),
        status: new FormControl('All'),  
      });
      this.editDepositSettings = new FormGroup({
          _id: new FormControl('', [Validators.required]),
          annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
          interval: new FormControl('', [Validators.required]),
          duration: new FormControl('', [Validators.required]),
          amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
          penality_rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      });
      this.settingsService.getGeneralSettings$().subscribe(settings => {
        if (settings) {
          this.rd_rate = settings.recurring_deposit_rate || 0;
          this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
        }
      });
      this.getRecrruingDeposits();
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
  
      this.depositService.getAllCompulsoryDeposits(this.page, this.pageSize,queryParams).subscribe((res: any) => {
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
      this.editDepositSettings.patchValue(user)
      this.modalService.open(settingModal, { size: 'lg', centered: true });
    }
  
    editSettings() {
      if (this.editDepositSettings.valid) {
        const payload = this.editDepositSettings.value;
        payload.status = 'Confirmed';
        this.depositService.editRDepositSettings(payload).subscribe((res: any) => {
          if (res && res.status === 'success') {
            this.editDepositSettings.reset();
            this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
            this.modalService.dismissAll();
            this.getRecrruingDeposits();
          }
        }, error => {
          console.error('Error updating deposit settings:', error);
        });
      } else {
        this.editDepositSettings.markAllAsTouched();
      }
    }

}
