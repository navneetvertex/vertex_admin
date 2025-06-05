import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoanService } from 'src/app/core/services/loan.service';

@Component({
  selector: 'app-loan-transanction',
  templateUrl: './loan-transanction.component.html',
  styleUrls: ['./loan-transanction.component.scss']
})
export class LoanTransanctionComponent implements OnInit {

  constructor(private loanService: LoanService,) { }
  breadCrumbItems: Array<{}>;

  transanctionList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'User Loan Transanction', active: true }];
    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      loan_id: new FormControl(''),
      transaction_id: new FormControl(''),
      transaction_type: new FormControl(''),
      payment_method: new FormControl(''),
      transaction_date: new FormControl(''),
    });
    this.getTransanctionList();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getTransanctionList();
  }

  getTransanctionList() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');

    this.loanService.getUserTransaction(queryParams).subscribe((data: any) => {
      this.transanctionList = data.data.userTransaction
      this.total = data.data.total
    })
  }

  refresh() {
    this.page = 1;
    this.getTransanctionList();
  }

}
