import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreditCardService } from 'src/app/core/services/credit-card.service';

@Component({
  selector: 'app-all-transanction',
  templateUrl: './all-transanction.component.html',
  styleUrls: ['./all-transanction.component.scss']
})
export class AllTransanctionComponent implements OnInit {

  constructor(private creditCardService: CreditCardService) { }
  breadCrumbItems: Array<{}>;
  transactionList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Admin transanctions', active: true }];
    this.getAdminTransactionList();
  }

  getAdminTransactionList() {
    this.creditCardService.getAdminCreditCardTransactions(this.page, this.pageSize).subscribe({
      next: (response: any) => {
        this.transactionList = response.data.transactions;
        console.log('Transaction List:', this.transactionList);
        this.total = response.data.total;
      },
      error: (error) => {
        console.error('Error fetching transaction list:', error);
      }
    });
  }

  pageChange(event: any) {
    this.page = event;
    this.getAdminTransactionList();
  }

  findPageShowing() {
    return (this.page - 1) * this.pageSize + 1;
  }

}
