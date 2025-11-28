import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/core/services/payment.service';

declare var $: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  isProcessing: boolean = false;
  scriptLoaded: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.paymentForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
      payment_purpose: new FormControl('wallet_topup', [Validators.required]),
      payment_mode: new FormControl('all', [Validators.required])
    });

    // Load Paynimo script
    this.loadPaynimoScript();
  }

  async loadPaynimoScript() {
    try {
      await this.paymentService.loadPaynimoScript();
      this.scriptLoaded = true;
      console.log('Paynimo script loaded successfully');
    } catch (error) {
      console.error('Failed to load Paynimo script:', error);
      this.toast.error('Failed to load payment gateway', 'Error');
    }
  }

  async initiatePayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.scriptLoaded) {
      this.toast.error('Payment gateway not ready. Please refresh the page.', 'Error');
      return;
    }

    this.isProcessing = true;

    try {
      const payload = this.paymentForm.value;

      const response: any = await this.paymentService.initiatePayment(payload).toPromise();

      if (response && response.status === 'success') {
        const checkoutConfig = response.data.checkout_config;

        // Add response handler
        checkoutConfig.consumerData.responseHandler = this.handlePaymentResponse.bind(this);

        // Open Paynimo checkout
        $.pnCheckout(checkoutConfig);

        if (checkoutConfig.features.enableNewWindowFlow) {
          this.checkPaymentStatus(response.data.transaction_id);
        }
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      const errorMessage = error.error?.message || 'Failed to initiate payment';
      this.toast.error(errorMessage, 'Error');
    } finally {
      this.isProcessing = false;
    }
  }

  handlePaymentResponse(res: any) {
    console.log('Payment response:', res);

    if (typeof res != "undefined" &&
        typeof res.paymentMethod != "undefined" &&
        typeof res.paymentMethod.paymentTransaction != "undefined" &&
        typeof res.paymentMethod.paymentTransaction.statusCode != "undefined") {

      const statusCode = res.paymentMethod.paymentTransaction.statusCode;

      if (statusCode === "0300") {
        // Success
        this.toast.success('Payment completed successfully!', 'Success');
        this.paymentForm.reset({
          amount: '',
          payment_purpose: 'wallet_topup',
          payment_mode: 'all'
        });
      } else if (statusCode === "0398") {
        // Initiated
        this.toast.info('Payment initiated. Please wait for confirmation.', 'Info');
      } else {
        // Failed
        const errorMsg = res.paymentMethod.paymentTransaction.errorMessage || 'Payment failed';
        this.toast.error(errorMsg, 'Payment Failed');
      }
    } else {
      this.toast.error('Invalid payment response', 'Error');
    }
  }

  checkPaymentStatus(transactionId: string) {
    // Poll for payment status
    const interval = setInterval(() => {
      this.paymentService.getTransactionStatus(transactionId).subscribe(
        (res: any) => {
          if (res && res.status === 'success') {
            const transaction = res.data.transaction;

            if (transaction.status === 'Success') {
              this.toast.success('Payment completed successfully!', 'Success');
              clearInterval(interval);
              this.paymentForm.reset();
            } else if (transaction.status === 'Failed') {
              this.toast.error('Payment failed', 'Error');
              clearInterval(interval);
            }
          }
        },
        (error) => {
          console.error('Status check error:', error);
          clearInterval(interval);
        }
      );
    }, 3000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
    }, 300000);
  }

}
