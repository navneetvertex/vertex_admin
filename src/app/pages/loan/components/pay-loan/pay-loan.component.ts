import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private toast: ToastrService
  ) { }

  breadCrumbItems: Array<{}>;
  paymentFormGroup: FormGroup;
  userDetails: any = null;
  loanList: any[] = [];
  paymentMethods: any[] = ['Cash', 'Bank Transfer', 'Cash', 'Cheque']
  totalPayableAmount: number = 0;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Pay Loans', active: true }];
    this.paymentFormGroup = new FormGroup({
      id : new FormControl('', Validators.required),
      loanId: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      paymentMethod: new FormControl('', Validators.required),
      transactionId: new FormControl('', Validators.required)
    });
  }

  getDetails() {
    if(!this.paymentFormGroup.value.id) return;
    this.userService.getBasicUserProfile(this.paymentFormGroup.value.id).subscribe({
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
    this.loanService.getTotalPaymentAmount(evt._id).subscribe({
      next: (res: any) => {
        console.log('Total Payment Amount:', res);
        if (res.status) {
          this.totalPayableAmount = res?.data?.outstandingAmount;
        } else {
          console.error('Error fetching total payment amount:', res.message);
        }
      }
      , error: (err) => {
        console.error('Error fetching total payment amount:', err);
      }
    });
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
    if (this.paymentFormGroup.invalid) {
      console.error('Payment form is invalid');
      return;
    }

    const paymentData = {
      ...this.paymentFormGroup.value
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
          // Reset form or show success message
          this.paymentFormGroup.reset();
          this.totalPayableAmount = 0;
        } else {
          this.toast.success('Error recording payment:');
        }
      }, error: (err) => {
        this.toast.success('Error recording payment:');
      }
    });
  }

}
