import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-closure-request',
  templateUrl: './account-closure-request.component.html',
  styleUrls: ['./account-closure-request.component.scss']
})
export class AccountClosureRequestComponent implements OnInit {

  constructor(private userService: UserProfileService,
    private toast: ToastrService
  ) { }

  breadCrumbItems: Array<{}>;
  closureRequests: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  Math = Math; // Expose Math to template

  searchFormGroup: FormGroup;
  statusList: any[] = ['active', 'inactive'];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Account Closure' }, { label: 'Requests', active: true }];

    this.searchFormGroup = new FormGroup({
      search: new FormControl(''),
      status: new FormControl('')
    });

    this.getClosureRequests();
  }

  search() {
    this.page = 1;
    this.getClosureRequests();
  }

  reset() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.getClosureRequests();
  }

  pageChange(page: number) {
    this.page = page;
    this.getClosureRequests();
  }

  getClosureRequests() {
    this.loading = true;
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];

    // Add page and limit
    queryParamArray.push(`page=${this.page}`);
    queryParamArray.push(`limit=${this.pageSize}`);

    // Add search parameters
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '' && searchParams[key] !== undefined) {
        queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');

    this.userService.getAccountClosureRequests(queryParams).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.closureRequests = res.data.requests || [];
          this.total = res.data.pagination?.totalRequests || 0;
        } else {
          this.closureRequests = [];
          this.total = 0;
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching closure requests:', err);
        this.closureRequests = [];
        this.total = 0;
        this.toast.error('Failed to load account closure requests');
      }
    });
  }

  viewUserProfile(userId: string) {
    // Navigate to user profile - you can implement this based on your routing
    window.open(`/members/profile/form/${userId}`, '_blank');
  }

  approveClosureRequest(user: any) {
    Swal.fire({
      title: 'Approve Account Closure?',
      html: `
        <p>Are you sure you want to approve the account closure request for:</p>
        <div class="alert alert-info">
          <strong>${user.name}</strong> (${user.user_id})<br/>
          Account: ${user.account_number || 'N/A'}<br/>
          Requested: ${new Date(user.account_closure_requested_date).toLocaleDateString()}
        </div>
        <p class="text-danger"><strong>Warning:</strong> This action will permanently close the user's account.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve Closure',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would call an API to approve the closure
        // For now, just show success message
        this.toast.success(`Account closure approved for ${user.name}`);
        this.getClosureRequests(); // Refresh the list
      }
    });
  }

  rejectClosureRequest(user: any) {
    Swal.fire({
      title: 'Reject Account Closure?',
      html: `
        <p>Are you sure you want to reject the account closure request for:</p>
        <div class="alert alert-info">
          <strong>${user.name}</strong> (${user.user_id})<br/>
          Account: ${user.account_number || 'N/A'}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject Request',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would call an API to reject the closure
        // For now, just show success message
        this.toast.success(`Account closure request rejected for ${user.name}`);
        this.getClosureRequests(); // Refresh the list
      }
    });
  }

}
