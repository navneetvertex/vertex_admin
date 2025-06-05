import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receive-gift-cards',
  templateUrl: './receive-gift-cards.component.html',
  styleUrls: ['./receive-gift-cards.component.scss']
})
export class ReceiveGiftCardsComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Receive', active: true }];
  }

}
