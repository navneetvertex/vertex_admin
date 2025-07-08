import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-franchise-list',
  templateUrl: './franchise-list.component.html',
  styleUrls: ['./franchise-list.component.scss']
})
export class FranchiseListComponent implements OnInit {

  franchiseList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchFormGroup: FormGroup ;
  queryParams: string = '';
  breadCrumbItems: Array<{}>;

  constructor(private franchiseService: FranchiseService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Franchise' }, { label: 'List', active: true }];
    
    this.searchFormGroup = new FormGroup({
      search: new FormControl(''),
      status: new FormControl(''),
    });
    this.getFranchises();
  }

  search() {
    this.page = 1; // Reset to the first page on search
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    this.queryParams = queryParamArray.join('&');
    this.getFranchises();
  }

  getFranchises() {
    this.franchiseService.getFranchises(this.page, this.pageSize, this.queryParams).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.franchiseList = response.data.franchises || [];
          this.total = response.data.total || 0;
        }
      },
      error: (error) => {
        console.error('Error fetching franchise list:', error);
      }
    });
  }

  resetSearch() {
    this.searchFormGroup.reset();
    this.page = 1;
    this.queryParams = '';
    this.getFranchises();
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getFranchises();
  }

  changeStatus(fund: any) {
    console.log('Changing status for:', fund);
    Swal.fire({
      title: 'Change Status',
      text: `Are you sure you want to change the status of ${fund?.user?.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        const statusData = { status: fund.status === 'Active' ? 'Inactive' : 'Active' };
        this.franchiseService.changeFranchiseStatus(fund._id, {status: !fund.status}).subscribe({
          next: (res: any) => {
            if (res && res.status === 'success') {
              Swal.fire('Success', `Franchise status has been changed to ${statusData.status}.`, 'success');
              this.getFranchises();
            } else {
              Swal.fire('Error', 'Failed to change the franchise status. Please try again.', 'error');
            }
          },
          error: (err: any) => {
            console.error('Error changing franchise status:', err);
            Swal.fire('Error', 'Failed to change the franchise status. Please try again.', 'error');
          }
        });
      }
    });
  }

}
