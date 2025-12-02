import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoanService } from 'src/app/core/services/loan.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.scss']
})
export class PayLoanComponent implements OnInit {

  constructor(private userService: UserProfileService,
    private loanService: LoanService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    // Initialize userDetails and loanList
    this.userDetails = null;
    this.loanList = [];

    // Get query parameters

  }

  breadCrumbItems: Array<{}>;
  paymentFormGroup: FormGroup;
  userDetails: any = null;
  loanList: any[] = [];
  paymentMethods: any[] = ['Cash']
  totalPayableAmount: number = 0;
  totalOutstandingAmount: number = 0; // Total remaining for entire loan (for clear off)
  userId: string = '';
  clearOffLoan: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Pay Loans', active: true }];
    this.paymentFormGroup = new FormGroup({
      id : new FormControl('', Validators.required),
      loanId: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      paymentMethod: new FormControl('', Validators.required)
    });
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.paymentFormGroup.patchValue({ id: params['user'] });
        this.userId = params['user'];
        this.getDetails();
      }
      if (params['id']) {
        this.paymentFormGroup.patchValue({ loanId: params['id'] });
        this.getTotalPaybleAmount({ _id: params['id'] });
      }
    });
  }

  getDetails() {
    let userId = this.paymentFormGroup.value.id;
    if(!userId) {
      userId = this.userId
    };
    this.userService.getBasicUserProfile(userId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userDetails = res?.data?.user;
          this.getAllLoans(this.userDetails._id);
        }
      }, error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  getTotalPaybleAmount(evt: any) {
    this.clearOffLoan = false; // Reset checkbox when loan changes
    this.loanService.getTotalPaymentAmount(evt._id).subscribe({
      next: (res: any) => {
        console.log('Total Payment Amount:', res);
        if (res.status) {
          this.totalPayableAmount = res?.data?.outstandingAmount;
          // Get total remaining for entire loan (for clear off feature)
          this.totalOutstandingAmount = parseFloat(res?.data?.breakdown?.totalRemainingAmount) || 0;
          this.paymentFormGroup.patchValue({ amount: this.totalPayableAmount });
          this.paymentFormGroup.get('amount')?.disable();
        } else {
          console.error('Error fetching total payment amount:', res.message);
        }
      }
      , error: (err) => {
        console.error('Error fetching total payment amount:', err);
      }
    });
  }

  onClearOffLoanChange() {
    if (this.clearOffLoan) {
      // When clear off is checked, disable payment method and amount
      this.paymentFormGroup.get('paymentMethod')?.disable();
      this.paymentFormGroup.get('amount')?.disable();
    } else {
      // When unchecked, enable payment method
      this.paymentFormGroup.get('paymentMethod')?.enable();
      this.paymentFormGroup.get('amount')?.disable(); // Keep amount disabled as it's auto-filled
    }
  }

  getAllLoans(userId: string) {
    this.loanService.getAllUserActiveLoans(userId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.loanList = res?.data?.loans.map((loan: any) => ({
            _id: loan._id,
            label: `${loan.loan_id} Amount: ${loan.approved_loan_amount} Purpose: ${loan.purpose}`,
          }));
        } else {
          console.error('Error fetching loans:', res.message);
        }
      }, error: (err) => {
        console.error('Error fetching loans:', err);
      }
    });
  }

  payLoanFees() {
    const loanId = this.paymentFormGroup.get('loanId')?.value;

    if (!loanId) {
      this.toast.error('Please select a loan');
      return;
    }

    // If clear off loan is checked, call clearOffLoan API
    if (this.clearOffLoan) {
      this.loanService.clearOffLoan({ loanId }).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.toast.success(`Loan cleared off successfully. Waived amount: ₹${res.data.waivedAmount}`);
            this.paymentFormGroup.reset();
            this.totalPayableAmount = 0;
            this.totalOutstandingAmount = 0;
            this.clearOffLoan = false;
            this.loanList = [];
            this.userDetails = null;
          } else {
            this.toast.error('Error clearing off loan');
          }
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Error clearing off loan');
        }
      });
      return;
    }

    // Regular payment flow
    if (this.paymentFormGroup.invalid) {
      console.error('Payment form is invalid');
      return;
    }

    const paymentData = {
      ...this.paymentFormGroup.getRawValue(),
      amount: this.totalPayableAmount
    };

    paymentData.amount = parseFloat(paymentData.amount);

    if (paymentData.amount <= 0) {
      this.toast.error('Amount must be greater than zero');
      return;
    }
    if (paymentData.amount > this.totalPayableAmount) {
      this.toast.error('Amount exceeds total payable amount');
      return;
    }

    this.loanService.recordPayment(paymentData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.success('Payment recorded successfully');
          this.paymentFormGroup.reset();
          this.totalPayableAmount = 0;
          this.totalOutstandingAmount = 0;
          this.loanList = [];
          this.userDetails = null;
        } else {
          this.toast.error('Error recording payment');
        }
      }, error: (err) => {
        this.toast.error(err.error?.message || 'Error recording payment');
      }
    });
  }

}
