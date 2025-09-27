import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/core/services/deposit.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private depositService: DepositService,
    private toast: ToastrService,
    private userService: UserProfileService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getProfile(this.user_id)
    this.getDepositSettings();
   }
  breadCrumbItems: Array<{}>;
  settingFormGroup: FormGroup;
  @ViewChild('editSettingModal') editSettingModal: TemplateRef<any>;
  editSettingFormGroup: FormGroup;
  addDepositFormGroup: FormGroup;
  closeFDFormGroup: FormGroup;
  profile: any = {};
  editAddDepositFormGroup: FormGroup;
  user_id: string;
  depositSettings: any[] = [];
  selectedSetting: any = null;
  isUserRequested: boolean = false;
  depositList: any[] = [];
  fd_rate: number = 0;
  canMakeDeposits: boolean = false;
  canRequestClosure: boolean = false;

  // Duration options based on MIS selection
  durationOptions: { value: string, label: string }[] = [
    { value: '5', label: '5 Years' },
    { value: '6', label: '6 Years' },
    { value: '7', label: '7 Years' },
    { value: '8', label: '8 Years' },
    { value: '9', label: '9 Years' },
    { value: '10', label: '10 Years' }
  ];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Member' }, { label: 'Fixed Deposit', active: true }];
    this.settingFormGroup = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      duration: new FormControl('', [Validators.required]),
      maturity_amount: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      isMIS: new FormControl(false)
      // indirect_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      // direct_refer_per: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
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


    this.addDepositFormGroup = new FormGroup({
      // per_day_rate: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]),
      // required_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      tot_paid_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transaction_id: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })

    this.editAddDepositFormGroup = new FormGroup({
      per_day_rate: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]),
      required_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      tot_paid_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl({value: '', disabled: true}, [Validators.required]),
      transaction_id: new FormControl({value: '', disabled: true}, [Validators.required]),
      _id: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    })

    this.closeFDFormGroup = new FormGroup({
      penalty_amount: new FormControl(0, [Validators.min(0)]),
      final_amount: new FormControl({value: 0, disabled: true}),
      notes: new FormControl('')
    });

    // Calculate final amount when penalty changes
    this.closeFDFormGroup.get('penalty_amount')?.valueChanges.subscribe(value => {
      this.calculateFinalAmount();
    });

    this.settingsService.getGeneralSettings$().subscribe(settings => {
      if (settings) {
        this.fd_rate = settings.recurring_deposit_rate || 0;
        this.editSettingFormGroup.patchValue({annual_rate: this.fd_rate});
        this.settingFormGroup.patchValue({annual_rate: this.fd_rate});
      }
    });
  }

  onMISChange() {
    const isMIS = this.settingFormGroup.get('isMIS')?.value;
    if (isMIS) {
      // When MIS is selected, limit duration options to 1, 1.5, and 2 years
      this.durationOptions = [
        { value: '1', label: '1 Year' },
        { value: '1.5', label: '1.5 Years' },
        { value: '2', label: '2 Years' }
      ];
      // Reset duration if current value is not in MIS options
      const currentDuration = this.settingFormGroup.get('duration')?.value;
      if (currentDuration && !['1', '1.5', '2'].includes(currentDuration)) {
        this.settingFormGroup.patchValue({ duration: '' });
      }
    } else {
      // When MIS is not selected, show all duration options
      this.durationOptions = [
        { value: '5', label: '5 Years' },
        { value: '6', label: '6 Years' },
        { value: '7', label: '7 Years' },
        { value: '8', label: '8 Years' },
        { value: '9', label: '9 Years' },
        { value: '10', label: '10 Years' }
      ];
    }
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

  getDepositSettings() {
    this.depositService.getFDepositSettings(this.user_id).subscribe({
      next: (res : any) => {
        this.depositSettings = res.data.settings || [];
        if (this.depositSettings.length > 0) {
          this.selectedSetting = this.depositSettings[0];
          this.isUserRequested = this.selectedSetting.status === 'Requested';

          // Check if user can make new deposits (only for Approved status)
          this.canMakeDeposits = this.depositSettings.some(setting =>
            setting.status === 'Approved'
          );

          // Check if user can request closure (only for Approved status)
          this.canRequestClosure = this.depositSettings.some(setting =>
            setting.status === 'Approved'
          );

          if(this.isUserRequested) {
             this.editSettingFormGroup.patchValue({annual_rate: this.fd_rate});
              this.modalService.open(this.editSettingModal, {size: 'lg', centered: true, backdrop: 'static', keyboard: false});
          }
          this.editSettingFormGroup.patchValue(this.selectedSetting);
            this.addDepositFormGroup.patchValue({
              tot_paid_amt: this.selectedSetting.amount,
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
      const payload = this.settingFormGroup.value
      payload.user = this.user_id;
      console.log('Payload for creating deposit setting:', payload.amount, payload.annual_rate, Number(payload.duration));
      const simpleInterest = (payload.amount * payload.annual_rate * Number(payload.duration)) / 100;
      const maturityAmount = payload.amount + simpleInterest;
      payload.maturity_amount = parseFloat(maturityAmount.toFixed(2));
      this.depositService.createFDepositSettings(payload).subscribe({
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
      const payload = this.editSettingFormGroup.value;
      payload.maturity_amount  = (payload.amount + ((payload.amount * payload.annual_rate * payload.duration) / 100)).toFixed(2);
      payload.status = 'Completed';
      console.log('Payload for editing deposit setting:', payload);
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
      this.editSettingFormGroup.patchValue(this.selectedSetting);
      this.addDepositFormGroup.patchValue({
          tot_paid_amt: this.selectedSetting.amount,
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
        tot_paid_amt: this.selectedSetting.amount,
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

  requestCloseFD() {
    // Calculate penalty if there are outstanding amounts
    const hasOutstanding = this.selectedSetting.amount > 0; // For FD, check if principal is still there

    let warningText = "You want to close this Fixed Deposit Account!";
    if (hasOutstanding) {
      warningText += `\n\nNote: This account has an outstanding principal amount of ₹${this.selectedSetting.amount}. Early closure may incur penalties.`;
    }
    warningText += "\n\nType 'CLOSE' to confirm.";

    Swal.fire({
      title: "Request FD Closure",
      text: warningText,
      icon: hasOutstanding ? "warning" : "question",
      input: "text",
      inputPlaceholder: "Type CLOSE to confirm",
      inputValidator: (value) => {
        if (value !== "CLOSE") {
          return "You need to type 'CLOSE' to confirm!";
        }
      },
      showCancelButton: true,
      confirmButtonColor: hasOutstanding ? "#ff6b35" : "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, request closure!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Prepare payload with basic closure request
        const payload = {
          _id: this.selectedSetting._id,
          status: 'Close-Requested',
          penalty_amount: 0, // Will be set by admin
          final_amount: this.selectedSetting.maturity_amount, // Maturity amount as final
          closure_notes: hasOutstanding ?
            `Admin requested closure with outstanding principal: ₹${this.selectedSetting.amount}` :
            'Admin requested closure'
        };

        this.depositService.editFDepositSettings(payload).subscribe((res: any) => {
          if (res && res.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'FD Closure Requested',
              text: 'The FD closure request has been submitted successfully.',
              confirmButtonText: 'OK'
            });
            // Refresh the settings to update status
            this.getDepositSettings();
          } else {
            this.toast.error('Failed to request FD closure', 'Error');
          }
        }, error => {
          console.error('Error requesting FD closure:', error);
          let errorMessage = 'Failed to request FD closure. Please try again.';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.toast.error(errorMessage, 'Error');
        });
      }
    });
  }

  calculateFinalAmount() {
    const penalty = this.closeFDFormGroup.get('penalty_amount')?.value || 0;
    const maturityAmount = this.selectedSetting?.maturity_amount || 0;
    const finalAmount = maturityAmount - penalty;

    this.closeFDFormGroup.patchValue({
      final_amount: Math.max(0, finalAmount) // Ensure final amount is not negative
    });
  }

  openCloseFDModal(content: any) {
    // Calculate final amount when opening modal
    this.calculateFinalAmount();
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
  }

  submitCloseFDRequest() {
    if (this.closeFDFormGroup.valid) {
      const formData = this.closeFDFormGroup.value;

      Swal.fire({
        title: "Confirm Closure Request",
        text: `Are you sure you want to request closure with penalty amount ₹${formData.penalty_amount}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Request Closure"
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            _id: this.selectedSetting._id,
            status: 'Close-Requested',
            penalty_amount: formData.penalty_amount,
            final_amount: formData.final_amount,
            closure_notes: formData.notes
          };

          this.depositService.editFDepositSettings(payload).subscribe((res: any) => {
            if (res && res.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Closure Request Submitted',
                text: 'The FD closure request has been submitted successfully.',
                confirmButtonText: 'OK'
              });
              this.closeFDFormGroup.reset();
              this.modalService.dismissAll();
              this.getDepositSettings(); // Refresh the settings
            } else {
              this.toast.error('Failed to submit closure request', 'Error');
            }
          }, error => {
            console.error('Error submitting closure request:', error);
            this.toast.error('Error submitting closure request', 'Error');
          });
        }
      });
    } else {
      this.closeFDFormGroup.markAllAsTouched();
    }
  }

}
