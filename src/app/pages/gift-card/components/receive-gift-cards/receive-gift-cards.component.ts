import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-receive-gift-cards',
  templateUrl: './receive-gift-cards.component.html',
  styleUrls: ['./receive-gift-cards.component.scss']
})
export class ReceiveGiftCardsComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;
  giftList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;
  

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Receive', active: true }];
  }

  pageChange(event: any) {
    this.page = event;
    this.getAllGifts();
  }

  refresh() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.getAllGifts();
  }
  
  getAllGifts() {
    
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

}
