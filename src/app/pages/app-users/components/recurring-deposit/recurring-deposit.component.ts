import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/core/services/deposit.service';

@Component({
  selector: 'app-recurring-deposit',
  templateUrl: './recurring-deposit.component.html',
  styleUrls: ['./recurring-deposit.component.scss']
})
export class RecurringDepositComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private depositService: DepositService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) { 
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getDepositSettings();
  }

  breadCrumbItems: Array<{}>;
  saveDepositSettings : FormGroup
  editDepositSettings : FormGroup
  depositFormGroup: FormGroup
  editDepositFormGroup: FormGroup
  rdSettlementFormGroup: FormGroup;
  user_id: string = ''; 

  depositSettingsList: any = [];
  depositList: any = [];
  selectedSetting: any = null;

  total: number = 0;
  page: number = 1;
  pageSize: number = 10;

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
      pay_day_rate: new FormControl({value:'', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      required_amount: new FormControl({value:'', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_interval: new FormControl({value:'', disabled: true}, [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      status: new FormControl('', [Validators.required])
    });

    this.editDepositFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      pay_day_rate: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      required_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_interval: new FormControl('', [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      status: new FormControl('', [Validators.required])
    });

    this.rdSettlementFormGroup = new FormGroup({
      total_principal: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_penalty: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_interest: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      total_net: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      settlement_date: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
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
        if(this.depositSettingsList.length > 0) {
          this.getDeposits(this.depositSettingsList[0]._id);
          this.selectedSetting = this.depositSettingsList[0]
          console.log('Selected Setting:', this.selectedSetting);
          this.editDepositSettings.patchValue(this.depositSettingsList[0])
          this.depositFormGroup.patchValue({ transanction_id: this.generateUniqueId(),  required_amount: this.depositSettingsList[0].amount, payment_interval: this.depositSettingsList[0].interval, pay_day_rate: +(this.selectedSetting.annual_rate / 365).toFixed(2), });
        }
      } else {
        this.toast.error('Failed to fetch deposit settings', 'Error');
      }
    }, error => {
      console.error('Error fetching deposit settings:', error);
      this.toast.error('Error fetching deposit settings', 'Error');
    });
  }

  getDeposits(setting: string) {
    this.depositService.getRDeposits(setting).subscribe((res: any) => {
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
      payload.user = this.user_id;
      payload.r_deposit_settings = this.selectedSetting._id;
      payload.pay_day_rate = 0.1; // Assuming this is a fixed value
      payload.required_amount = this.selectedSetting.amount;
      payload.payment_interval = this.selectedSetting.interval;
      this.depositService.createRDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit created successfully');
          this.depositFormGroup.reset();
          this.modalService.dismissAll();
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
