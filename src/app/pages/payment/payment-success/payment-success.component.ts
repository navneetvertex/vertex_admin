import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from 'src/app/core/services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  transaction: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    const txnId = this.route.snapshot.queryParamMap.get('txn');
    if (txnId) {
      this.loadTransaction(txnId);
    } else {
      this.loading = false;
      this.error = 'Transaction ID not found';
    }
  }

  loadTransaction(txnId: string) {
    this.paymentService.getPublicTransactionStatus(txnId).subscribe({
      next: (res: any) => {
        this.transaction = res.data?.transaction;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load transaction details';
        this.loading = false;
      }
    });
  }
}
