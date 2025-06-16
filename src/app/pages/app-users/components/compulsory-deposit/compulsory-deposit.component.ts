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
    this.getDepositSettings();
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

  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  profile: any = {};
  isSettingsAdded: boolean = false;

  

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Member' }, { label: 'Compulsory Deposit', active: true }];
    this.saveDepositSettings = new FormGroup({
      annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      interval: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.editDepositSettings = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      interval: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.depositFormGroup = new FormGroup({
      payment_interval: new FormControl({value:'', disabled: true}, [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.editDepositFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      payment_interval: new FormControl('', [Validators.required]),
      paid_amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transanction_id: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

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
      payload.c_deposit_setting = this.allDepositLists._id
      payload.payment_interval = this.allDepositLists.interval;
      this.depositService.createCDeposit(payload).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.toast.success('Deposit created successfully');
          this.depositFormGroup.reset();
          this.modalService.dismissAll();
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
    this.depositService.getCompulsoryDeposits(this.user_id).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data) {
        const depositData = res.data.deposits || null;
        this.total = depositData.allDeposits?.length || 0;
        this.allDepositLists = depositData;
        if (depositData && Object.keys(depositData).length > 0) {
          this.listAvialble = depositData.allDeposits && depositData.allDeposits.length > 0;
          this.depositAnnualRate = depositData.annual_rate || 0;
          this.depositFormGroup.patchValue({
            pay_day_rate: +(this.depositAnnualRate / 365).toFixed(2),
            required_amount: depositData.amount,
            payment_interval: depositData.interval,
            transanction_id: this.generateUniqueId()
          });
          this.isSettingsAdded = true;
          this.editDepositSettings.patchValue(depositData);
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
