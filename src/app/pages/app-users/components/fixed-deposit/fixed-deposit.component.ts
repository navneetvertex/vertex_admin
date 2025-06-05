import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/core/services/deposit.service';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private depositService: DepositService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getDepositSettings();
   }
  breadCrumbItems: Array<{}>;
  settingFormGroup: FormGroup;
  editSettingFormGroup: FormGroup;
  addDepositFormGroup: FormGroup;
  editAddDepositFormGroup: FormGroup;
  user_id: string;
  depositSettings: any[] = [];
  selectedSetting: any = null;
  depositList: any[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Member' }, { label: 'Fixed Deposit', active: true }];
    this.settingFormGroup = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      duration: new FormControl('', [Validators.required]),
      maturity_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      indirect_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      direct_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
    });

    this.editSettingFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      duration: new FormControl('', [Validators.required]),
      maturity_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      indirect_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      direct_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
    });


    this.addDepositFormGroup = new FormGroup({
      per_day_rate: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]),
      required_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      tot_paid_amt: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transaction_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })

    this.editAddDepositFormGroup = new FormGroup({
      per_day_rate: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]),
      required_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      tot_paid_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl({value: '', disabled: true}, [Validators.required]),
      transaction_id: new FormControl({value: '', disabled: true}, [Validators.required]),
      status: new FormControl('', [Validators.required]),
      _id: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  getDepositSettings() {
    this.depositService.getFDepositSettings(this.user_id).subscribe({
      next: (res : any) => {
        this.depositSettings = res.data.settings || [];
        if (this.depositSettings.length > 0) {
          this.selectedSetting = this.depositSettings[0];
          this.editSettingFormGroup.patchValue(this.selectedSetting);
            this.addDepositFormGroup.patchValue({
              required_amt: this.selectedSetting.amount,
              per_day_rate: +(this.selectedSetting.annual_rate / 365).toFixed(2),
              transaction_id: this.generateUniqueId()
          });
          this.getDeposits(this.selectedSetting._id);
        } else {
          this.selectedSetting = null;
          this.editSettingFormGroup.reset();
        }
        this.settingFormGroup.reset();
      },
      error: (err) => {
        this.toast.error(err.error.message || 'Failed to fetch deposit settings');
      }
    });
  }

  saveSetting()  {
    if (this.settingFormGroup.valid) {
      this.depositService.createFDepositSettings({...this.settingFormGroup.value , user : this.user_id}).subscribe({
        next: (res) => {
          this.toast.success('Deposit setting created successfully');
          this.modalService.dismissAll();
          this.getDepositSettings();
          this.settingFormGroup.reset();
        },
        error: (err) => {
          this.toast.error(err.error.message || 'Failed to create deposit setting');
        }
      });
    } else {
      this.toast.error('Please fill all required fields correctly');
    }
  }

  editSetting() {
    if (this.editSettingFormGroup.valid) {
      this.depositService.editFDepositSettings(this.editSettingFormGroup.value).subscribe({
        next: (res) => {
          this.toast.success('Deposit setting updated successfully');
          this.modalService.dismissAll();
          this.getDepositSettings();
        },
        error: (err) => {
          this.toast.error(err.error.message || 'Failed to update deposit setting');
        }
      });
    } else {
      this.toast.error('Please fill all required fields correctly');
    }
  }

   settingsChanged(event: any) {
    const selectedSetting = this.depositSettings.find((setting: any) => setting._id === event.target.value);
    this.selectedSetting = selectedSetting
    if (selectedSetting) {
      this.editAddDepositFormGroup.patchValue(selectedSetting)
      this.addDepositFormGroup.patchValue({
        required_amt: this.selectedSetting.amount,
        per_day_rate: +(this.selectedSetting.annual_rate / 365).toFixed(2),
        transaction_id: this.generateUniqueId()
      });
      this.getDeposits(selectedSetting._id);
    }
  }

   generateUniqueId(): string {
    const year = new Date().getFullYear().toString();
    const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
    return year + randomPart;
  }

  getDeposits(settingId: string) {
    this.depositService.getFDeposits(settingId).subscribe({
      next: (res: any) => {
        this.depositList = res.data.deposits || [];
      },
      error: (err) => {
        this.toast.error(err.error.message || 'Failed to fetch deposits');
      }
    });
  }

  editDepositForm(content: any, deposit: any) {
    this.openModal(content);
    this.editAddDepositFormGroup.patchValue(deposit) 
  }

  addDeposit() {
    if (this.addDepositFormGroup.valid) {
      const payload = {
        ...this.addDepositFormGroup.value,
        f_deposit_setting: this.selectedSetting._id,
        user: this.user_id,
        required_amt: this.selectedSetting.amount,
        per_day_rate: +(this.selectedSetting.annual_rate / 365).toFixed(2)
      };
      this.depositService.createFDeposit(payload).subscribe({
        next: (res) => {
          this.toast.success('Fixed deposit created successfully');
          this.modalService.dismissAll();
          this.addDepositFormGroup.reset();
          this.getDeposits(this.selectedSetting._id);
        },
        error: (err) => {
          this.toast.error(err.error.message || 'Failed to create fixed deposit');
        }
      });
    } else {
      this.toast.error('Please fill all required fields correctly');
    }
  }
  editDeposit() {
    if (this.editAddDepositFormGroup.valid) {
      const payload = {
        ...this.editAddDepositFormGroup.value,
      };
      this.depositService.editFDeposit(payload).subscribe({
        next: (res) => {
          this.toast.success('Fixed deposit updated successfully');
          this.modalService.dismissAll();
          this.editAddDepositFormGroup.reset();
          this.getDeposits(this.selectedSetting._id);
        },
        error: (err) => {
          this.toast.error(err.error.message || 'Failed to update fixed deposit');
        }
      });
    } else {
      this.toast.error('Please fill all required fields correctly');
    }
  }

}
