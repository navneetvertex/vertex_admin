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
    closeFDFormGroup: FormGroup;
    statusList: any[] = ['Requested', 'Approved', 'Close-Requested', 'Completed']
    monthYearList: any[] = [];
    selectedUser: any = null;
    depositSummary: any = null;
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Deposit' }, { label: 'Fixed Deposit List', active: true }];
      
      // Generate combined month-year list from current month back to 2 years ago
      this.generateMonthYearList();
      
      this.searchFormGroup = new FormGroup({
        name:new FormControl(''),
        user_id: new FormControl(''),
        status: new FormControl('All'),
        monthYear: new FormControl('')
      });
      this.editSettingFormGroup = new FormGroup({
        _id: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        duration: new FormControl('', [Validators.required]),
        maturity_amount: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
        annual_rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
        user: new FormControl('', [Validators.required]),
        indirect_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
        direct_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
        franchise_refer_per: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
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

    getMonthName(monthIndex: number): string {
      const date = new Date();
      date.setMonth(monthIndex);
      return date.toLocaleString('default', { month: 'short' });
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
  
      this.depositService.getAllFixedDeposits(this.page, this.pageSize,queryParams).subscribe((res: any) => {
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
      this.editSettingFormGroup.patchValue(user);
      this.modalService.open(settingModal, { size: 'lg', centered: true });
    }
  
     editSetting() {
      if (this.editSettingFormGroup.valid) {
        const payload = this.editSettingFormGroup.value;
        payload.maturity_amount  = (payload.amount + ((payload.amount * payload.annual_rate * payload.duration) / 100)).toFixed(2);
        payload.status = 'Approved';
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

    openCloseFDModal(content: any, user: any) {
      this.selectedUser = user;
      // Fetch deposit summary for the selected user
      this.getDepositSummary(user?.user);
      this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    }

    getDepositSummary(userId: string) {
      // For fixed deposits, calculate summary based on the deposit settings
      // Since fixed deposits are lump sum, we use the amount from settings
      if (this.selectedUser) {
        const totalPaid = this.selectedUser.amount || 0;
        const annualRate = this.selectedUser.annual_rate || 0;
        const duration = this.selectedUser.duration || 0;
        
        // Calculate interest: (Principal * Rate * Time) / 100
        const totalInterest = (totalPaid * annualRate * duration) / 100;
        
        this.depositSummary = {
          paid: totalPaid,
          interest: totalInterest,
          total: totalPaid + totalInterest
        };
        this.calculateFinalAmount();
      } else {
        this.depositSummary = { paid: 0, interest: 0, total: 0 };
        this.calculateFinalAmount();
      }
    }

    calculateFinalAmount() {
      const penalty = this.closeFDFormGroup.get('penalty_amount')?.value || 0;
      const totalPaid = this.depositSummary?.paid || 0;
      const totalInterest = this.depositSummary?.interest || 0;
      const finalAmount = (totalPaid + totalInterest) - penalty;

      this.closeFDFormGroup.patchValue({
        final_amount: Math.max(0, finalAmount) // Ensure final amount is not negative
      });
    }

    submitCloseFDRequest() {
      // Validate that FD is in Close-Requested status
      if (this.selectedUser.status !== 'Close-Requested') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Status',
          text: 'This FD must be in "Close-Requested" status to process closure. Please wait for member to request closure first.'
        });
        return;
      }

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
              _id: this.selectedUser._id,
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
                this.getRecrruingDeposits(); // Refresh the settings
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
