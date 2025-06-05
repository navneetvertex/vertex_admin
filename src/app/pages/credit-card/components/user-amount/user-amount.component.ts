import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreditCardService } from 'src/app/core/services/credit-card.service';

@Component({
  selector: 'app-user-amount',
  templateUrl: './user-amount.component.html',
  styleUrls: ['./user-amount.component.scss']
})
export class UserAmountComponent implements OnInit {

  constructor(private creditCardService: CreditCardService) { }
  breadCrumbItems: Array<{}>;
  fundRequestList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Request to use amount', active: true }];
    

    this.searchFormGroup = new FormGroup({
      search : new FormControl(''),
      status: new FormControl(''),
    });

    this.getUserFundRequests();
  }

  search() {
    this.page = 1; // Reset to the first page on search
    this.getUserFundRequests();
  }

  resetSearch() {
    this.searchFormGroup.reset();
    this.page = 1;
    this.getUserFundRequests();
  }

  getUserFundRequests() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');

    this.creditCardService.getUserFundRequests(this.page, this.pageSize, queryParams).subscribe({
      next: (response: any) => {
        this.total = response?.data?.total || 0;
        this.fundRequestList = response?.data?.fundRequests || [];
      },
      error: (error) => {
        console.error('Error fetching user fund requests:', error);
      }
    });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }
  pageChange(page: number) {
    this.page = page;
    this.getUserFundRequests();
  }

}
