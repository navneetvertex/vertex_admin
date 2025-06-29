import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/core/services/deposit.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-compulsory-deposit',
  templateUrl: './compulsory-deposit.component.html',
  styleUrls: ['./compulsory-deposit.component.scss']
})
export class CompulsoryDepositComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private depositService: DepositService,
    private toast: ToastrService,
    private router: Router,
    private userService: UserProfileService,
  ) {
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getProfile(this.user_id);


  }

  user_id: string = '';
  breadCrumbItems: Array<{}>;
  saveDepositSettings : FormGroup
  editDepositSettings : FormGroup
  depositFormGroup: FormGroup
  editDepositFormGroup: FormGroup
  listAvialble : boolean = false;
  depositAnnualRate: number = 0;

  allDepositLists: any = [];
  settings: any = {};

  outstandingAmount: any = null;
  userIsNotActive: boolean = false;

  searchFormGroup: FormGroup;

  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  profile: any = {};
  isSettingsAdded: boolean = false;

  outstanding(user_id: string) {
    this.depositService.findOutstandingDepositsOfCompulsory(user_id).subscribe((res: any) => {
      console.log('Outstanding Deposits Response:', res);
      if (res && res.status === 'success') {
        const outstandingDeposits = res.data || [];
        this.outstandingAmount = outstandingDeposits;
        console.log('Outstanding Amount:', this.outstandingAmount);
        if (outstandingDeposits !== 0) {
          this.depositFormGroup.patchValue({paid_amount: this.outstandingAmount.outstanding });
          this.toast.info(`Outstanding compulsory deposits found: ₹${outstandingDeposits.outstanding}`);
        } else {
          this.toast.success('No outstanding compulsory deposits found.');
        }
      } else {
        this.toast.error('Failed to fetch outstanding deposits.');
      }
    }, (err: any) => {
      this.userIsNotActive = true;
    })
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Member' }, { label: 'Compulsory Deposit', active: true }];
    this.saveDepositSettings = new FormGroup({
      annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      interval: new FormControl('', [Validators.required]),
      penalty_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      amount: new FormControl('300', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(300)]),
    });

    this.editDepositSettings = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      interval: new FormControl('', [Validators.required]),
      penalty_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.depositFormGroup = new FormGroup({
      payment_interval: new FormControl({value:'', disabled: true}, [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.searchFormGroup = new FormGroup({
      transanction_id: new FormControl(''),
      status: new FormControl(''),
      payment_method: new FormControl(''),
      transaction_date: new FormControl(''),
    })

    this.editDepositFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      payment_interval: new FormControl('', [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.getDepositSettings();
    this.outstanding(this.user_id);

  }

  reset() {
    this.searchFormGroup.reset();
    this.page = 1;
    this.getDepositSettings();
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
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  addDeposit() {
    if (this.depositFormGroup.valid) {
      const payload = this.depositFormGroup.value;
      payload.user = this.user_id;
      payload.c_deposit_setting = this.settings._id
      payload.payment_interval = this.settings.interval;
      this.depositService.createCDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit created successfully');
          this.depositFormGroup.reset();
          this.modalService.dismissAll();
          this.outstanding(this.user_id);
          this.getDepositSettings();
        }
      }, (err: any) => {
        console.error('Error creating deposit:', err);
        this.toast.error('Failed to create deposit');
      });
    } else {
      this.depositFormGroup.markAllAsTouched();
    }
  }

  generateUniqueId(): string {
    const year = new Date().getFullYear().toString();
    const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
    return year + randomPart;
  }

  editDepositForm(content: any, deposit: any) {
    this.openModal(content);
    this.editDepositFormGroup.patchValue(deposit)
  }

  getDepositSettings() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');

    this.depositService.getCompulsoryDeposits(this.user_id,queryParams, this.page, this.pageSize).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data) {
        const depositData = res.data.deposits || null;

        this.total = res.data.total || 0;
        this.allDepositLists = depositData;
        this.settings = res.data.settings || {};

        this.listAvialble = depositData.length > 0;
        this.depositAnnualRate = this.settings.annual_rate || 0;

        this.depositFormGroup.patchValue({
            payment_interval: this.settings.interval,
            transanction_id: this.generateUniqueId()
        });

        if(this.listAvialble) {
            Object.keys(this.editDepositSettings.controls).forEach(control => {
              this.editDepositSettings.get(control)?.disable();
            });
        }

        if (this.settings && Object.keys(this.settings).length > 0) {
          this.isSettingsAdded = true;
          this.editDepositSettings.patchValue(this.settings);
        } else {
          this.listAvialble = false;
          this.isSettingsAdded = false;
          this.depositFormGroup.reset();
          this.editDepositSettings.reset();
        }
      }
    })
  }

  setting() {
    if (this.saveDepositSettings.valid) {
      const payload = this.saveDepositSettings.value;
      payload.user = this.user_id;
      this.depositService.compulsorySettings(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.isSettingsAdded = true;
          this.toast.success('Deposit settings saved successfully');
          this.saveDepositSettings.reset();
          this.modalService.dismissAll();
          this.depositFormGroup.patchValue({
            pay_day_rate: +(this.depositAnnualRate / 365).toFixed(2),
            required_amount: payload.amount,
            payment_interval: payload.interval,
            transanction_id: this.generateUniqueId()
          });
        }
      }, (err: any) => {
        console.error('Error saving deposit settings:', err);
        this.toast.error('Failed to save deposit settings');
      });
    } else {
      this.saveDepositSettings.markAllAsTouched();
    }
  }

  editSettings() {
    if (this.editDepositSettings.valid) {
      const payload = this.editDepositSettings.value;
      this.depositService.editCDepositSettings(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.isSettingsAdded = true;
          this.toast.success('Deposit settings updated successfully');
          this.modalService.dismissAll();
        }
      }, (err: any) => {
        console.error('Error updating deposit settings:', err);
        this.toast.error('Failed to update deposit settings');
      });
    } else {
      this.editDepositSettings.markAllAsTouched();
    }
  }

  editDeposit() {
    if (this.editDepositFormGroup.valid) {
      const payload = this.editDepositFormGroup.value;
      this.depositService.editCDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit updated successfully');
          this.modalService.dismissAll();
          this.getDepositSettings();
        }
      }, (err: any) => {
        console.error('Error updating deposit:', err);
        this.toast.error('Failed to update deposit');
      });
    } else {
      this.editDepositFormGroup.markAllAsTouched();
    }
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

}
