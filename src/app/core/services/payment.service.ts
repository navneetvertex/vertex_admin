import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  /**
   * Initiate payment
   */
  initiatePayment(data: any) {
    return this.http.post(`${environment.api_url}payment/initiate`, data);
  }

  /**
   * Get transaction status (authenticated)
   */
  getTransactionStatus(transactionId: string) {
    return this.http.get(`${environment.api_url}payment/transaction/${transactionId}`);
  }

  /**
   * Get public transaction status (for redirect pages - no auth required)
   */
  getPublicTransactionStatus(transactionId: string) {
    return this.http.get(`${environment.api_url}payment/status/${transactionId}`);
  }

  /**
   * Get payment history
   */
  getPaymentHistory(page: number = 1, limit: number = 10) {
    return this.http.get(`${environment.api_url}payment/history?page=${page}&limit=${limit}`);
  }

  /**
   * Load Paynimo checkout script
   */
  loadPaynimoScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if jQuery is loaded
      if (typeof (window as any).$ === 'undefined') {
        reject(new Error('jQuery is not loaded'));
        return;
      }

      // Check if Paynimo is already loaded
      if ((window as any).$.pnCheckout) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paynimo.com/paynimocheckout/server/lib/checkout.js';
      script.type = 'text/javascript';
      script.onload = () => {
        // Verify pnCheckout is available after loading
        if ((window as any).$.pnCheckout) {
          resolve(true);
        } else {
          reject(new Error('Paynimo checkout not initialized'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Paynimo script'));
      document.body.appendChild(script);
    });
  }
}
