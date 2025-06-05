import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-transanction',
  templateUrl: './all-transanction.component.html',
  styleUrls: ['./all-transanction.component.scss']
})
export class AllTransanctionComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;
  transactionList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'All transanction', active: true }];
  }

}
