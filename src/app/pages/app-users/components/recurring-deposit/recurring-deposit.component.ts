import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/core/services/deposit.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-recurring-deposit',
  templateUrl: './recurring-deposit.component.html',
  styleUrls: ['./recurring-deposit.component.scss']
})
export class RecurringDepositComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private depositService: DepositService,
    private toast: ToastrService,
    private userService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getProfile(this.user_id)
    this.getDepositSettings();
  }

  breadCrumbItems: Array<{}>;
  saveDepositSettings : FormGroup
  editDepositSettings : FormGroup
  depositFormGroup: FormGroup
  editDepositFormGroup: FormGroup
  rdSettlementFormGroup: FormGroup;
  canCreateSettings: boolean = true;

  @ViewChild('editSettingModal') editSettingModal: TemplateRef<any>;

  searchFormGroup: FormGroup ;
  user_id: string = ''; 
  profile: any = null;

  depositSettingsList: any = [];
  depositList: any = [];
  selectedSetting: any = null;
  outstandingAmount: any = null;
  depositSummary: any = null;

  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

  outstanding(user: string) {
    this.depositService.findOutstandingDepositsOfRecurring(user).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const outstandingDeposits = res.data || [];
        this.outstandingAmount = outstandingDeposits;
        this.depositSummary = res.data.depositSummary
        if (outstandingDeposits !== 0) {
          this.depositFormGroup.patchValue({paid_amount: this.outstandingAmount.outstanding });
          this.rdSettlementFormGroup.patchValue({total_principal: this.depositSummary.paid, total_penalty: this.depositSummary.penalty, total_interest: this.depositSummary.interest, total_net: this.depositSummary.total });
        } else {
          this.toast.success('No outstanding compulsory deposits found.');
        }
      } else {
        this.toast.error('Failed to fetch outstanding amount', 'Error');
      }
    }, error => {
      console.error('Error fetching outstanding amount:', error);
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Member' }, { label: 'Recurring Deposit', active: true }];

    this.saveDepositSettings = new FormGroup({
        annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        interval: new FormControl('', [Validators.required]),
        duration: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        penality_rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.editDepositSettings = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        interval: new FormControl('', [Validators.required]),
        duration: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        penality_rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.depositFormGroup = new FormGroup({
      payment_interval: new FormControl({value:'', disabled: true}, [Validators.required]),
      paid_amount: new FormControl({value:'', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.searchFormGroup = new FormGroup({
      created_date: new FormControl(''),
      status: new FormControl(''),
      payment_method: new FormControl(''),
      transanction_id: new FormControl(''),
    });

    this.editDepositFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      payment_interval: new FormControl('', [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.rdSettlementFormGroup = new FormGroup({
      total_principal: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_penalty: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_interest: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_net: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      settlement_date: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })
    // if(this.canCreateSettings) this.outstanding(this.user_id)
  }

  getProfile(user_id: string) {
    this.userService.getBasicUserProfile(user_id).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.profile = res.data.user || {};
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, (err: any) => {
      console.error('Error fetching user profile:', err);
      this.router.navigate(['/dashboard']);
    });
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
  }

  createSettings() {
    if (this.saveDepositSettings.valid) {
      const payload = this.saveDepositSettings.value;
      payload.user = this.user_id;
      this.depositService.createRDepositSettings(this.saveDepositSettings.value).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit settings saved successfully');
          this.saveDepositSettings.reset();
          this.modalService.dismissAll();
          this.getDepositSettings();
        }
      }, error => {
        console.error('Error creating deposit settings:', error);
        this.toast.error('Error creating deposit settings', 'Error');
      });
    } else {
      this.saveDepositSettings.markAllAsTouched();
    }
  }

  getDepositSettings() {
    this.depositService.getRDepositSettings(this.user_id).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.depositSettingsList = res.data.settings;
        this.canCreateSettings = this.depositSettingsList.some(setting => setting.status !== 'Requested');

        if(!this.canCreateSettings) {
          this.toast.warning('User has requested to open an RD Account. Please click on edit Setting, and fill required fields.', 'Warning');
          this.editDepositSettings.patchValue({ _id: this.depositSettingsList[0]._id, annual_rate: this.depositSettingsList[0].annual_rate, interval: this.depositSettingsList[0].interval, duration: this.depositSettingsList[0].duration, amount: this.depositSettingsList[0].amount, penality_rate: this.depositSettingsList[0].penality_rate });
           this.modalService.open(this.editSettingModal, {size: 'lg', centered: true, backdrop: 'static', keyboard: false});
        }

        if(this.depositSettingsList.length > 0 && this.canCreateSettings) {
          this.outstanding(this.user_id);
          this.getDeposits(this.depositSettingsList[0]._id);
          this.selectedSetting = this.depositSettingsList[0]
          this.editDepositSettings.patchValue(this.depositSettingsList[0])

          this.depositFormGroup.patchValue({ transanction_id: this.generateUniqueId(),  payment_interval: this.depositSettingsList[0].interval});
        }
      } else {
        this.toast.error('Failed to fetch deposit settings', 'Error');
      }
    }, error => {
      console.error('Error fetching deposit settings:', error);
      this.toast.error('Error fetching deposit settings', 'Error');
    });
  }

  reset() {
    this.searchFormGroup.reset()
    this.page = 1
    this.getDepositSettings()
  }

  getDeposits(setting: string) {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');


    this.depositService.getRDeposits(setting,this.page, this.pageSize, queryParams).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.depositList = res.data.deposits;
        this.total = this.depositList.length;
      } else {
        this.toast.error('Failed to fetch deposits', 'Error');
      }
    }, error => {
      console.error('Error fetching deposits:', error);
      this.toast.error('Error fetching deposits', 'Error');
    });
  }

  settingsChanged(event: any) {
    const selectedSetting = this.depositSettingsList.find((setting: any) => setting._id === event.target.value);
    this.selectedSetting = selectedSetting
    if (selectedSetting) {
      this.editDepositSettings.patchValue(selectedSetting)
      this.outstanding(this.user_id);
      this.depositFormGroup.patchValue({
        required_amount: selectedSetting.amount,
        payment_interval: selectedSetting.interval,
        pay_day_rate: +(this.selectedSetting.annual_rate / 365).toFixed(2),
        transanction_id: this.generateUniqueId()
      });
      this.getDeposits(selectedSetting._id);
    }
  }

  generateUniqueId(): string {
    const year = new Date().getFullYear().toString();
    const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
    return year + randomPart;
  }

  addDeposit() {
    if (this.depositFormGroup.valid) {
      const payload = this.depositFormGroup.value;

      if(payload.paid_amount > this.selectedSetting.amount) {
        this.toast.error('Paid amount must be lower than or equal to the required amount', 'Error');
        return;
      }
      
      payload.user = this.user_id;
      payload.r_deposit_settings = this.selectedSetting._id;
      payload.required_amount = this.selectedSetting.amount;
      payload.payment_interval = this.selectedSetting.interval;
      payload.paid_amount = this.selectedSetting.amount
      this.depositService.createRDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit created successfully');
          this.depositFormGroup.reset();
          this.modalService.dismissAll();
          this.outstanding(this.user_id);
          this.getDeposits(payload.r_deposit_settings);
        }
      }, error => {
        console.error('Error creating deposit:', error);
        this.toast.error('Error creating deposit', 'Error');
      });
    } else {
      this.depositFormGroup.markAllAsTouched();
    }
  }

  editDepositForm(content: any, deposit: any) {
    this.openModal(content);
    this.editDepositFormGroup.patchValue(deposit)
  }

  editDeposit() {
    if (this.editDepositFormGroup.valid) {
      const payload = this.editDepositFormGroup.value;
      payload.user = this.user_id;
      this.depositService.editRDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit updated successfully');
          this.editDepositFormGroup.reset();
          this.modalService.dismissAll();
          this.getDeposits(this.selectedSetting._id);
        }
      }, error => {
        console.error('Error updating deposit:', error);
        this.toast.error('Error updating deposit', 'Error');
      });
    } else {
      this.editDepositFormGroup.markAllAsTouched();
    }
  }

  editSettings() {
    if (this.editDepositSettings.valid) {
      const payload = this.editDepositSettings.value;
      payload.status = 'Confirmed';
      this.depositService.editRDepositSettings(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit settings updated successfully');
          this.editDepositSettings.reset();
          this.modalService.dismissAll();
          this.getDepositSettings();
        }
      }, error => {
        console.error('Error updating deposit settings:', error);
        this.toast.error('Error updating deposit settings', 'Error');
      });
    } else {
      this.editDepositSettings.markAllAsTouched();
    }
  }

}
