import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreditCardService } from 'src/app/core/services/credit-card.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payble-amount',
  templateUrl: './payble-amount.component.html',
  styleUrls: ['./payble-amount.component.scss']
})
export class PaybleAmountComponent implements OnInit {

  constructor(private userService: UserProfileService,
    private creditCardService: CreditCardService,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  payFormGroup: FormGroup;
  userDetails: any = null;
  creditCardList: any[] = [];
  fundList: any[] = [];
  totalPayableAmount: number = 0;
  paymentMethods: any[] = ['Cash', 'Bank Transfer', 'Cash', 'Cheque']

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Payable Amount', active: true }];
    this.payFormGroup = new FormGroup({
      user_id: new FormControl('', Validators.required),
      card_id: new FormControl('', Validators.required),
      transaction_id: new FormControl(''),
      payment_method: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }


  getUserDetails() {
    if(!this.payFormGroup.value.user_id) return;
    this.userService.getBasicUserProfile(this.payFormGroup.value.user_id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userDetails = res?.data?.user;
          this.getAllActiveCards(this.userDetails._id);
        }
      }, error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  getAllActiveCards(userId: string) {
    this.creditCardService.getActiveCreditCardsOfUser(userId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.creditCardList = res.data.cc;
          if (this.creditCardList.length > 0) {
            this.payFormGroup.get('card_id')?.setValue(this.creditCardList[0]._id);
            this.getTotalPaybleAmount(this.creditCardList[0]);
          }
          // this.creditCardList = this.creditCardList.map((card: any) => {
          //   return {
          //     _id: card._id,
          //     label: `${card.card_number} (Approved Card Limit: ₹${card.approved_credit_limit})`
          //   };
          // });
        }
      }, error: (err) => {
        console.error('Error fetching active cards:', err);
      }
    });
  }

  getTotalPaybleAmount(card_id: any) {
    if (!card_id || !card_id._id) {
      this.totalPayableAmount = 0;
      return;
    }
    this.creditCardService.getTotalPaybleAmount(card_id._id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.totalPayableAmount = res.data.outstanding;
          this.payFormGroup.get('amount')?.setValidators([Validators.required, Validators.min(1), Validators.max(this.totalPayableAmount)]);
          this.payFormGroup.updateValueAndValidity();
        }
      }, error: (err) => {
        console.error('Error fetching total payable amount:', err);
      }
    });
  }

  payCreditCardFees() {
    if (this.payFormGroup.invalid) {
      return;
    }

    if (this.payFormGroup.value.amount <= 0 || this.payFormGroup.value.amount > this.totalPayableAmount) {
      this.toast.warning('Please enter a valid amount to pay.');
      return;
    }

    const payload = {
      userId: this.userDetails._id,
      card_id: this.payFormGroup.value.card_id,
      amount: this.payFormGroup.value.amount
    };

    console.log('Payment Payload:', payload);

    this.creditCardService.payCreditCardFees(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.success('Payment successful!');
          Swal.fire({
            title: 'Payment Successful',
            text: `Your payment of ₹${this.payFormGroup.value.amount} has been successfully processed.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.payFormGroup.reset();
          this.totalPayableAmount = 0;
        } else {
          this.toast.error('Payment failed. Please try again.');
        }
      }, error: (err) => {
        console.error('Error processing payment:', err);
        this.toast.error('An error occurred while processing the payment.');
        Swal.fire({
          title: 'Payment Failed',
          text: 'There was an error processing your payment. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // getCreditFunds(card_id: any) {
  //   this.creditCardService.getAllFundRequestsOfCreditCard(card_id._id).subscribe({
  //     next: (res: any) => {
  //       if (res.status) {
  //        this.fundList = res.data.fundRequests.map((fund: any) => {
  //           return {
  //             _id: fund._id,
  //             label: `Amount: ₹${fund.amount} - Reason: ${fund.reason}`
  //           };
  //         });
  //       }
  //     }, error: (err) => {
  //       console.error('Error fetching credit funds:', err);
  //     }
  //   });
  // }


}
