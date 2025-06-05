import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-loan-transanction',
  templateUrl: './admin-loan-transanction.component.html',
  styleUrls: ['./admin-loan-transanction.component.scss']
})
export class AdminLoanTransanctionComponent implements OnInit {

  constructor() { }
  breadCrumbItems: Array<{}>;

  transanctionList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Admin Loan Transanction', active: true }];
    this.searchFormGroup = new FormGroup({
          name: new FormControl(''),
          transaction_id: new FormControl(''),
          transaction_type: new FormControl(''),
          payment_method: new FormControl(''),
          transaction_date: new FormControl(''),
        });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getTransanctionList();
  }

  getTransanctionList() {
  }

  refresh() {
    this.page = 1;
    this.getTransanctionList();
  }



}
