import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(private userService: UserProfileService, private toast: ToastrService) { }

  breadCrumbItems: Array<{}>;
  paymentList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup;
  exportLoading: boolean = false;

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

  exportToExcel() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');
    this.exportLoading = true;

    this.userService.exportTransferRequests(queryParams).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transfer_requests_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toast.success('Transfer requests exported successfully');
        this.exportLoading = false;
      },
      error: (err: any) => {
        console.error('Error exporting transfer requests:', err);
        this.toast.error('Failed to export transfer requests');
        this.exportLoading = false;
      }
    });
  }

}
