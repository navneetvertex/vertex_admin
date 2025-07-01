import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(private userService: UserProfileService) { }

  breadCrumbItems: Array<{}>;
  paymentList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Transfer Request' }, { label: 'Lists', active: true }];
    
    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      date: new FormControl('')
    });

    this.getBankTransferRequests();
  }

  getBankTransferRequests() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');
    this.userService.getAllTransferRequests(this.page, this.pageSize, queryParams).subscribe({
      next: (data: any) => {
        console.log('Bank Transfer Requests:', data.data.results);
        this.paymentList = data.data.results;
        this.total = data.data.total;
        this.page = data.data.page || 1;
        this.pageSize = data.data.limit || 10;
      },
      error: (error) => {
        console.error('Error fetching bank transfer requests:', error);
      }
    });
  }

  reset() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.getBankTransferRequests();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getBankTransferRequests();
  }

}
