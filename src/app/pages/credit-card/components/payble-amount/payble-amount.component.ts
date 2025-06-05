import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payble-amount',
  templateUrl: './payble-amount.component.html',
  styleUrls: ['./payble-amount.component.scss']
})
export class PaybleAmountComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Payable Amount', active: true }];
  }

}
