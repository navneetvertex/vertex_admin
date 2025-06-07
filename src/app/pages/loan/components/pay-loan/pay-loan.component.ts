import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.scss']
})
export class PayLoanComponent implements OnInit {

  constructor() { }

  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Pay Loans', active: true }];
  }

}
