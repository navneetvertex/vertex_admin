import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
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

  //@ViewChild('requestForm') requestFormRef!: TemplateRef<any>;
  @ViewChild('addDepositModal') addDepositModalRef!: TemplateRef<any>;
  @ViewChild('editSettingModal') editSettingModal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
    private depositService: DepositService,
    private toast: ToastrService,
    private userService: UserProfileService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getProfile(this.user_id);
    this.getDepositSettings();
   }
    breadCrumbItems: Array<{}>;
    addDepositFormGroup: FormGroup;
    settingFormGroup: FormGroup;
    closeFDFormGroup: FormGroup;
    editSettingFormGroup: FormGroup;
    editAddDepositFormGroup: FormGroup;
    user_id: string;
    depositSettings: any[] = [];
    depositList: any[] = [];
    selectedSetting: any = null;
    profile: any = null;
    isFDOpen: boolean = false;
    canMakeDeposits: boolean = false;
    canRequestClosure: boolean = false;
    depositSummary: any = {};
    page: number = 1;
    pageSize: number = 10;
    total: number = 0;
    outstandingAmount: any = null;
    fdOutstandingAmounts: { [key: string]: any } = {}; // Store outstanding amounts for multiple FDs
    isLoadingStatistics: boolean = false;
    isLoadingAccountStatistics: boolean = false;
    isUserRequested: boolean = false;
    fd_rate: number = 0;

    // Duration options based on MIS selection
    durationOptions: { value: string, label: string }[] = [
      { value: '1', label: '1 Year' },
      { value: '1.5', label: '1.5 Years' },
      { value: '2', label: '2 Years' },
      { value: '2.5', label: '2.5 Years' },
      { value: '3', label: '3 Years' },
      { value: '3.5', label: '3.5 Years' },
      { value: '4', label: '4 Years' },
      { value: '4.5', label: '4.5 Years' },
      { value: '5', label: '5 Years' },
      { value: '5.5', label: '5.5 Years' },
      { value: '6', label: '6 Years' },
      { value: '6.5', label: '6.5 Years' },
      { value: '7', label: '7 Years' },
      { value: '7.5', label: '7.5 Years' },
      { value: '8', label: '8 Years' },
      { value: '8.5', label: '8.5 Years' },
      { value: '9', label: '9 Years' },
      { value: '9.5', label: '9.5 Years' },
      { value: '10', label: '10 Years' }
    ];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Fixed Deposit', active: true }];
    this.getDepositSettings();
    this.settingFormGroup = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(10000), Validators.max(200000)]),
      duration: new FormControl('', [Validators.required]),
      compounding_frequency: new FormControl('1', [Validators.required]), // Default to annual (1)
      isMIS: new FormControl(false),
      annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      indirect_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      direct_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      franchise_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      notes: new FormControl('')
    });
    
    this.addDepositFormGroup = new FormGroup({
      tot_paid_amt: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl('', [Validators.required]),
      transaction_id: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    });

    this.editSettingFormGroup = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(10000), Validators.max(200000)]),
      duration: new FormControl('', [Validators.required]),
      maturity_amount: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      compounding_frequency: new FormControl('1', [Validators.required]), // Default to annual (1)
      user: new FormControl('', [Validators.required]),
      isMIS: new FormControl(false),
      indirect_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      direct_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      franchise_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
    });

    this.editAddDepositFormGroup = new FormGroup({
      per_day_rate: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]),
      required_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      tot_paid_amt: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      payment_method: new FormControl({value: '', disabled: true}, [Validators.required]),
      transaction_id: new FormControl({value: '', disabled: true}, [Validators.required]),
      _id: new FormControl('', [Validators.required]),
      status: new FormControl({value: '', disabled: true}, [Validators.required]),
      notes: new FormControl('')
    });

    this.closeFDFormGroup = new FormGroup({
      penalty_amount: new FormControl(0, [Validators.min(0)]),
      final_amount: new FormControl({value: 0, disabled: true}),
      notes: new FormControl('')
    });

    // Calculate final amount when penalty changes
    this.closeFDFormGroup.get('penalty_amount')?.valueChanges.subscribe(value => {
      this.calculateFinalAmount();
    });

    // Handle MIS checkbox changes
    this.settingFormGroup.get('isMIS')?.valueChanges.subscribe(isMIS => {
      if (isMIS) {
        // If MIS is selected, limit duration to max 2 years
        const currentDuration = this.settingFormGroup.get('duration')?.value;
        if (currentDuration && parseFloat(currentDuration) > 2) {
          this.settingFormGroup.get('duration')?.setValue('2');
        }
        this.updateDurationOptions();
      } else {
        this.updateDurationOptions();
      }
    });

    // Handle MIS checkbox changes for edit form
    this.editSettingFormGroup.get('isMIS')?.valueChanges.subscribe(isMIS => {
      if (isMIS) {
        // If MIS is selected, limit duration to max 2 years
        const currentDuration = this.editSettingFormGroup.get('duration')?.value;
        const durationNum = parseFloat(currentDuration);
        if (currentDuration && durationNum > 2) {
          this.editSettingFormGroup.get('duration')?.setValue('2');
        }
      }
    });

    this.settingsService.getGeneralSettings$().subscribe(settings => {
      if (settings) {
        this.fd_rate = settings.recurring_deposit_rate || 0;
        this.editSettingFormGroup.patchValue({annual_rate: this.fd_rate});
        this.settingFormGroup.patchValue({annual_rate: this.fd_rate});
      }
    });
  }

  updateDurationOptions() {
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
        { value: '1', label: '1 Year' },
        { value: '1.5', label: '1.5 Years' },
        { value: '2', label: '2 Years' },
        { value: '2.5', label: '2.5 Years' },
        { value: '3', label: '3 Years' },
        { value: '3.5', label: '3.5 Years' },
        { value: '4', label: '4 Years' },
        { value: '4.5', label: '4.5 Years' },
        { value: '5', label: '5 Years' },
        { value: '5.5', label: '5.5 Years' },
        { value: '6', label: '6 Years' },
        { value: '6.5', label: '6.5 Years' },
        { value: '7', label: '7 Years' },
        { value: '7.5', label: '7.5 Years' },
        { value: '8', label: '8 Years' },
        { value: '8.5', label: '8.5 Years' },
        { value: '9', label: '9 Years' },
        { value: '9.5', label: '9.5 Years' },
        { value: '10', label: '10 Years' }
      ];
    }
  }
  onMISChange() {
    const isMIS = this.settingFormGroup.get('isMIS')?.value;
    this.updateDurationOptions();
  }

  calculateMaturityAmount() {
    const amount = this.editSettingFormGroup.get('amount')?.value;
    const duration = this.editSettingFormGroup.get('duration')?.value;
    const annualRate = this.editSettingFormGroup.get('annual_rate')?.value;
    const compoundingFrequency = this.editSettingFormGroup.get('compounding_frequency')?.value;

    console.log('Calculating maturity amount with:', { amount, duration, annualRate, compoundingFrequency });

    if (amount && duration && annualRate && compoundingFrequency) {
      // Compound Interest formula: A = P * (1 + r/n)^(n*t)
      const principal = parseFloat(amount);
      const rate = parseFloat(annualRate) / 100; // Convert percentage to decimal
      const time = parseFloat(duration);
      const n = parseInt(compoundingFrequency); // Compounding frequency
      
      const maturityAmount = principal * Math.pow((1 + rate / n), n * time);
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
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
  }

  openFixedDepositForm(content: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to open an Fixed Deposit Account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, request it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalService.open(content, { size: 'lg', backdrop: 'static' });
      }
    });
  }

  openNewFDAccount(content: any) {
    Swal.fire({
      title: "Are you sure?", 
      text: "You want to open a Fixed Deposit Account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, request it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalService.open(content, { size: 'lg', backdrop: 'static' });
      }
    });
  }

  openAddDepositModal() {
    if (this.addDepositModalRef) {
      this.modalService.open(this.addDepositModalRef, { size: 'lg', backdrop: 'static' });
    }
  }

  getDepositSettings() {
    this.depositService.getFDepositSettings(this.user_id).subscribe({
      next: (res : any) => {
        this.depositSettings = res.data.settings || [];
        if (this.depositSettings.length > 0) {
          this.selectedSetting = this.depositSettings[0];
          this.isUserRequested = this.selectedSetting.status === 'Requested';

          // Check if FD account exists and is in an active state
          this.isFDOpen = this.depositSettings.some(setting =>
            setting.status === 'Approved' ||
            setting.status === 'Completed' ||
            setting.status === 'Close-Requested'
          );

          // Check if user can make new deposits (only for Approved status)
          this.canMakeDeposits = this.depositSettings.some(setting =>
            setting.status === 'Approved'
          );

          // Check if user can request closure (only for Approved status)
          this.canRequestClosure = this.depositSettings.some(setting =>
            setting.status === 'Approved'
          );

          if(this.isFDOpen && this.depositSettings.some(setting => setting.status === 'Approved')) {
            // Load outstanding amounts for all FD accounts to display in overview cards
            this.loadOutstandingAmountsForAllAccounts();
          }

          // Refresh statistics after a short delay to ensure data is loaded
          setTimeout(() => {
            this.refreshStatistics();
          }, 500);

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
      const payload = { ...this.settingFormGroup.value };
      payload.user = this.user_id;
      
      // Compound Interest formula: A = P * (1 + r/n)^(n*t)
      const principal = payload.amount;
      const rate = payload.annual_rate / 100; // Convert percentage to decimal
      const time = Number(payload.duration);
      const n = parseInt(payload.compounding_frequency); // Compounding frequency
      
      payload.maturity_amount = parseFloat((principal * Math.pow((1 + rate / n), n * time)).toFixed(2));
      this.depositService.createFDepositSettings(payload).subscribe({
        next: (res) => {
          this.toast.success('Deposit setting created successfully');
          this.modalService.dismissAll();
          this.getDepositSettings();
          this.settingFormGroup.reset({
            amount: '',
            duration: '',
            compounding_frequency: '1',
            notes: '',
            isMIS: false,
            annual_rate: this.fd_rate
          });
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
      // Ensure duration is a number for calculation
      const duration = parseFloat(payload.duration);
      
      // Compound Interest formula: A = P * (1 + r/n)^(n*t)
      const principal = payload.amount;
      const rate = payload.annual_rate / 100; // Convert percentage to decimal
      const time = duration;
      const n = parseInt(payload.compounding_frequency); // Compounding frequency
      
      payload.maturity_amount = (principal * Math.pow((1 + rate / n), n * time)).toFixed(2);
      payload.status = 'Approved';
      console.log('Payload for editing deposit setting:', payload);
      this.depositService.editFDepositSettings(payload).subscribe({
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

  addDeposit() {
    if (this.addDepositFormGroup.valid) {
      // Extra safety check - ensure selected account is approved
      if (this.selectedSetting?.status !== 'Approved') {
        this.toast.error('Deposits can only be made to approved FD accounts', 'Error');
        return;
      }

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
          
          // Refresh outstanding amount first
          this.outstanding(this.user_id, this.selectedSetting._id);
          
          // Refresh deposits and check if due transaction should be removed
          this.getDeposits(this.selectedSetting._id);
          
          // After refreshing data, check if outstanding is zero and remove due transaction
          setTimeout(() => {
            const outstandingData = this.fdOutstandingAmounts[this.selectedSetting._id];
            if (!outstandingData || outstandingData.outstanding <= 0) {
              // Remove due transaction if outstanding is paid off
              this.depositList = this.depositList.filter((deposit: any) => deposit.status !== 'Due');
            }
          }, 500);
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

  settingsChanged(event: any) {
    const selectedSetting = this.depositSettings.find((setting: any) => setting._id === event.target.value);
    if (selectedSetting) {
      this.selectFDAccount(selectedSetting);
    }
  }

  // Track by function for ngFor optimization
  trackBySettingId(index: number, setting: any): any {
    return setting._id;
  }

  // Select a specific FD account
  selectFDAccount(setting: any): void {
    console.log('Selecting FD account:', setting._id, 'Status:', setting.status);
    this.selectedSetting = setting;

    // Update form with selected setting details
    this.addDepositFormGroup.patchValue({
      tot_paid_amt: setting.amount,
      transaction_id: this.generateUniqueId()
    });

    // Load deposits for this specific FD account
    this.getDeposits(setting._id);

    // Handle outstanding amounts and statistics based on account status
    if (setting.status === 'Approved') {
      // Load outstanding amount and statistics for approved accounts
      this.outstanding(this.user_id, setting._id);
      // Refresh outstanding amounts for all accounts
      this.loadOutstandingAmountsForAllAccounts();
    } else {
      // Clear outstanding data for non-approved accounts
      this.outstandingAmount = null;
      this.depositSummary = {
        interest: 0,
        paid: 0,
        penalty: 0,
        total: 0
      };
      // Clear the form amount for non-approved accounts
      this.addDepositFormGroup.patchValue({tot_paid_amt: ''});
      // Force change detection
      this.cdr.detectChanges();
    }

    // Scroll to the details section
    setTimeout(() => {
      const element = document.getElementById('fd-details-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Refresh statistics
      this.refreshStatistics();
    }, 100);
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
        
        // Add due amount transaction if there's outstanding amount for this FD
        this.addDueTransactionForFD(settingId);
      },
      error: (err) => {
        this.toast.error(err.error.message || 'Failed to fetch deposits');
      }
    });
  }

  editDepositForm(content: any, deposit: any) {
    this.openModal(content);
    this.editAddDepositFormGroup.patchValue(deposit);
  }

  // Load outstanding amounts for all approved FD accounts
  loadOutstandingAmountsForAllAccounts(): void {
    const approvedSettings = this.depositSettings.filter(setting => setting.status === 'Approved');

    if (approvedSettings.length === 0) {
      return;
    }

    this.isLoadingStatistics = true;

    // Use API that returns outstanding amounts for all FD settings
    this.depositService.findOutstandingDepositsOfFixed(this.user_id, approvedSettings[0]._id).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const outstandingData = res.data;

        // Store outstanding data for each setting ID
        this.fdOutstandingAmounts = outstandingData;

        console.log('FD outstanding amounts loaded:', this.fdOutstandingAmounts);

        this.isLoadingStatistics = false;

        // Update due transaction for currently selected FD if any
        if (this.selectedSetting) {
          this.addDueTransactionForFD(this.selectedSetting._id);
        }

        // Trigger change detection for the statistics
        setTimeout(() => {
          this.refreshStatistics();
        }, 100);
      }
    }, error => {
      console.error('Error fetching outstanding for FD accounts:', error);
      this.isLoadingStatistics = false;
    });
  }

  // Outstanding method for FD
  outstanding(user: string, fd_id?: string) {
    console.log('Loading outstanding for FD:', fd_id);
    this.isLoadingAccountStatistics = true;

    this.depositService.findOutstandingDepositsOfFixed(user, fd_id).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const outstandingDeposits = res.data || [];
        this.outstandingAmount = outstandingDeposits;
        this.depositSummary = res.data.depositSummary;

        console.log('FD outstanding data loaded:', {
          fd_id,
          outstanding: this.outstandingAmount,
          summary: this.depositSummary
        });

        if (outstandingDeposits !== 0) {
          this.addDepositFormGroup.patchValue({tot_paid_amt: this.outstandingAmount.outstanding });
        }

        this.isLoadingAccountStatistics = false;
        
        // Update due transaction for this FD
        if (fd_id) {
          this.addDueTransactionForFD(fd_id);
        }
        
        // Force change detection to update the UI
        this.cdr.detectChanges();
      } else {
        this.toast.error('Failed to fetch outstanding amount', 'Error');
        this.isLoadingAccountStatistics = false;
      }
    }, error => {
      console.error('Error fetching outstanding amount:', error);
      this.isLoadingAccountStatistics = false;
    });
  }

  // Helper methods for multiple account summary
  getActiveAccountsCount(): number {
    if (!this.depositSettings) return 0;
    return this.depositSettings.filter(setting => setting.status === 'Approved').length;
  }

  getTotalPrincipal(): number {
    if (!this.depositSettings) return 0;
    return this.depositSettings
      .filter(setting => setting.status === 'Approved')
      .reduce((total, setting) => total + (Number(setting.amount) || 0), 0);
  }

  getTotalMaturityValue(): number {
    if (!this.depositSettings) return 0;
    return this.depositSettings
      .filter(setting => setting.status === 'Approved')
      .reduce((total, setting) => total + (Number(setting.maturity_amount) || 0), 0);
  }

  getTotalOutstanding(): number {
    if (!this.fdOutstandingAmounts || Object.keys(this.fdOutstandingAmounts).length === 0) {
      return 0;
    }

    // Sum up outstanding amounts from all FD accounts
    const total = Object.values(this.fdOutstandingAmounts)
      .reduce((sum: number, outstanding: any) => {
        const amount = outstanding?.outstanding || 0;
        return sum + (Number(amount) || 0);
      }, 0);

    return total;
  }

  // Refresh statistics - forces Angular change detection
  refreshStatistics(): void {
    // Trigger change detection by accessing the properties
    const activeCount = this.getActiveAccountsCount();
    const totalPrincipal = this.getTotalPrincipal();
    const totalOutstanding = this.getTotalOutstanding();

    console.log('FD statistics refreshed:', {
      activeAccounts: activeCount,
      totalPrincipal,
      totalOutstanding,
      outstandingAmounts: this.fdOutstandingAmounts
    });
  }

  // Refresh all data - useful for manual refresh
  refreshAllData(): void {
    console.log('Refreshing all FD data...');
    this.getDepositSettings();
  }

  // Helper method to check if current selected FD can accept deposits
  canSelectedAccountMakeDeposits(): boolean {
    return this.selectedSetting?.status === 'Approved' && this.outstandingAmount?.outstanding > 0;
  }

  // Helper method to check if current selected FD can request closure
  canSelectedAccountRequestClosure(): boolean {
    return this.selectedSetting?.status === 'Approved';
  }

  addDueTransactionForFD(settingId: string) {
    // Remove any existing due transaction first
    this.depositList = this.depositList.filter((deposit: any) => deposit.status !== 'Due');
    
    // Add due amount transaction if there's outstanding amount for this FD
    const outstandingData = this.fdOutstandingAmounts[settingId];
    if (this.outstandingAmount > 0) {
      const dueTransaction = {
        created_date: '',
        tot_paid_amt: outstandingData.outstanding,
        payment_method: 'Pending',
        transaction_id: 'FD-DUE-' + this.generateUniqueId(),
        status: 'Due'
      };
      this.depositList.unshift(dueTransaction);
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
        title: "Confirm FD Closure",
        text: `Are you sure you want to process this FD closure with penalty amount ₹${formData.penalty_amount}? This will mark the account as completed.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Process Closure"
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            _id: this.selectedSetting._id,
            status: 'Completed',
            penalty_amount: formData.penalty_amount,
            final_amount: this.closeFDFormGroup.get('final_amount')?.value,
            closure_notes: formData.notes
          };

          this.depositService.editFDepositSettings(payload).subscribe((res: any) => {
            if (res && res.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'FD Closure Processed',
                text: 'The FD closure has been processed successfully. The final settlement amount has been recorded.',
                confirmButtonText: 'OK'
              });
              this.closeFDFormGroup.reset();
              this.modalService.dismissAll();
              this.getDepositSettings(); // Refresh the settings
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to process FD closure'
              });
            }
          }, error => {
            console.error('Error processing FD closure:', error);
            let errorMessage = 'Failed to process FD closure. Please try again.';

            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage
            });
          });
        }
      });
    } else {
      this.closeFDFormGroup.markAllAsTouched();
    }
  }

}
