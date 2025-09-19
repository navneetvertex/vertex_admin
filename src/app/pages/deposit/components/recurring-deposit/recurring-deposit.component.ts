import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositService } from 'src/app/core/services/deposit.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recurring-deposit',
  templateUrl: './recurring-deposit.component.html',
  styleUrls: ['./recurring-deposit.component.scss']
})
export class RecurringDepositComponent implements OnInit {

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
  closeRDFormGroup: FormGroup;
  editDepositSettings: FormGroup;
  statusList: any[] = ['Requested', 'Approved', 'Completed', 'Close-Requested']
  monthYearList: any[] = [];
  selectedUser: any = null;
  depositSummary: any = null;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Deposit' }, { label: 'Recurring Deposit List', active: true }];
    
    // Generate combined month-year list from current month back to 2 years ago
    this.generateMonthYearList();
    
    this.searchFormGroup = new FormGroup({
      name:new FormControl(''),
      user_id: new FormControl(''),
      status: new FormControl('All'),
      monthYear: new FormControl('')
    });
    this.editDepositSettings = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        annual_rate: new FormControl('' , [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        interval: new FormControl('', [Validators.required]),
        duration: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
    });

    this.closeRDFormGroup = new FormGroup({
      penalty_amount: new FormControl(0, [Validators.min(0)]),
      final_amount: new FormControl({value: 0, disabled: true}),
      notes: new FormControl('')
    });

    // Calculate final amount when penalty changes
    this.closeRDFormGroup.get('penalty_amount')?.valueChanges.subscribe(value => {
      this.calculateFinalAmount();
    });

    this.settingsService.getGeneralSettings$().subscribe(settings => {
      if (settings) {
        this.rd_rate = settings.recurring_deposit_rate || 0;
        this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
      }
    });
    this.getRecrruingDeposits();
  }

  generateMonthYearList() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based
    
    // Generate from current month back to 2 years ago
    for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
      const year = currentYear - yearOffset;
      
      // For current year, start from current month
      // For previous years, start from December
      const startMonth = (yearOffset === 0) ? currentMonth : 11;
      const endMonth = (yearOffset === 2) ? 0 : 0; // For 2 years ago, start from January
      
      for (let month = startMonth; month >= endMonth; month--) {
        const monthName = months[month];
        const monthValue = (month + 1).toString().padStart(2, '0'); // 01-12 format
        const displayText = `${monthName} ${year}`;
        const value = `${year}-${monthValue}`; // YYYY-MM format
        
        this.monthYearList.push({
          display: displayText,
          value: value
        });
      }
    }
  }

  getRecrruingDeposits() {

    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '' && searchParams[key] !== undefined) {
        if (key === 'monthYear') {
          // Split the combined value into separate month and year parameters
          const [year, month] = searchParams[key].split('-');
          queryParamArray.push(`month=${encodeURIComponent(month)}`);
          queryParamArray.push(`year=${encodeURIComponent(year)}`);
        } else {
          queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
        }
      }
    });

    const queryParams = queryParamArray.join('&');

    this.depositService.getAllRecurringDeposits(this.page, this.pageSize,queryParams).subscribe((res: any) => {
      if (res.status) {
        this.userList = res.data.deposits;
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
    this.settingsService.getGeneralSettings$().subscribe(settings => {
      if (settings) {
        this.rd_rate = settings.recurring_deposit_rate || 0;
        this.editDepositSettings.patchValue({annual_rate: this.rd_rate});
      }
    });
    this.modalService.open(settingModal, { size: 'lg', centered: true });
  }

  openCloseRDModal(content: any, user: any) {
    this.selectedUser = user;
    // Fetch deposit summary for the selected user and specific RD
    this.getDepositSummary(user?.user?._id, user?._id);
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
  }

  getDepositSummary(userId: string, rdId?: string) {
    console.log('Getting deposit summary for userId:', userId, 'rdId:', rdId);
    this.depositService.findOutstandingDepositsOfRecurring(userId, rdId).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.depositSummary = res.data.depositSummary;
        console.log('Deposit summary updated:', this.depositSummary);
        this.calculateFinalAmount();
      } else {
        this.depositSummary = null;
      }
    }, error => {
      console.error('Error fetching deposit summary:', error);
      this.depositSummary = { paid: 0, interest: 0, total: 0 };
      this.calculateFinalAmount();
    });
  }

  calculateFinalAmount() {
    const penalty = this.closeRDFormGroup.get('penalty_amount')?.value || 0;
    const totalPaid = this.depositSummary?.paid || 0;
    const totalInterest = this.depositSummary?.interest || 0;
    const finalAmount = (totalPaid + totalInterest) - penalty;

    this.closeRDFormGroup.patchValue({
      final_amount: Math.max(0, finalAmount) // Ensure final amount is not negative
    });
  }

  editSettings() {
    if (this.editDepositSettings.valid) {
      Swal.fire({
        title: 'Confirm Action',
        text: 'Type "CONFIRMED" to approve the deposit settings.',
        input: 'text',
        inputPlaceholder: 'Type "CONFIRMED" here',
        inputValidator: (value) => {
          if (value !== 'CONFIRMED') {
            return 'You must type "CONFIRMED" to proceed!';
          }
        },
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Confirm',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = this.editDepositSettings.value;
          payload.status = 'Approved';
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
        }
      });
    } else {
      this.editDepositSettings.markAllAsTouched();
    }
  }

  submitCloseRDRequest() {
    // Validate that RD is in Close-Requested status
    if (this.selectedUser.status !== 'Close-Requested') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Status',
        text: 'This RD must be in "Close-Requested" status to process closure. Please wait for member to request closure first.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.closeRDFormGroup.valid) {
      const formData = this.closeRDFormGroup.value;

      
      formData.final_amount = this.closeRDFormGroup.get('final_amount')?.value;



      Swal.fire({
        title: "Confirm RD Closure",
        text: `Are you sure you want to process this RD closure with penalty amount ₹${formData.penalty_amount}? This will mark the account as completed.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Process Closure"
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            _id: this.selectedUser._id,
            status: 'Completed',
            penalty_amount: formData.penalty_amount,
            final_amount: formData.final_amount,
            closure_notes: formData.notes
          };

          this.depositService.editRDepositSettings(payload).subscribe((res: any) => {
            if (res && res.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'RD Closure Processed',
                text: 'The RD closure has been processed successfully. The final settlement amount has been recorded.',
                confirmButtonText: 'OK'
              });
              this.closeRDFormGroup.reset();
              this.modalService.dismissAll();
              this.getRecrruingDeposits(); // Refresh the list
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Processing Failed',
                text: 'Failed to process RD closure. Please try again.',
                confirmButtonText: 'OK'
              });
            }
          }, error => {
            console.error('Error processing RD closure:', error);
            let errorMessage = 'Failed to process RD closure. Please try again.';

            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }

            Swal.fire({
              icon: 'error',
              title: 'Processing Failed',
              text: errorMessage,
              confirmButtonText: 'OK'
            });
          });
        }
      });
    } else {
      this.closeRDFormGroup.markAllAsTouched();
    }
  }

}
