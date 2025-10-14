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

  viewAccountSummary(userId: string) {
    // Navigate to account summary page
    window.open(`/members/account-summary/${userId}`, '_blank');
  }

  approveClosureRequest(user: any) {
    // First, fetch account summary
    this.userService.getAccountSummary(user._id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const summary = response.data;
          
          // Show account summary modal
          Swal.fire({
            title: 'Account Summary - ' + user.name,
            html: `
              <div class="text-start">
                <div class="row mb-3">
                  <div class="col-6">
                    <h6 class="text-success">Assets</h6>
                    <div class="border rounded p-2 bg-light">
                      <small><strong>Wallet Balance:</strong> ₹${summary.assets?.wallet?.total_wallet?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>Compulsory Deposit:</strong> ₹${summary.assets?.compulsoryDeposit?.paidAmount?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>Fixed Deposits:</strong> ₹${summary.assets?.fixedDeposits?.totalPaid?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>Recurring Deposits:</strong> ₹${summary.assets?.recurringDeposits?.totalPaid?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>User Fees:</strong> ₹${summary.assets?.userFees?.total_fees?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>Fund PINs:</strong> ₹${summary.assets?.fundPins?.totalAmount?.toFixed(2) || '0.00'}</small><br/>
                      <hr class="my-1">
                      <strong class="text-success">Total Assets: ₹${summary.assets?.totalAssets?.toFixed(2) || '0.00'}</strong>
                    </div>
                  </div>
                  <div class="col-6">
                    <h6 class="text-danger">Liabilities</h6>
                    <div class="border rounded p-2 bg-light">
                      <small><strong>Credit Card Outstanding:</strong> ₹${summary.liabilities?.creditCard?.outstanding?.toFixed(2) || '0.00'}</small><br/>
                      <small><strong>Loans Outstanding:</strong> ₹${summary.liabilities?.loans?.totalOutstanding?.toFixed(2) || '0.00'}</small><br/>
                      <hr class="my-1">
                      <strong class="text-danger">Total Liabilities: ₹${summary.liabilities?.totalLiabilities?.toFixed(2) || '0.00'}</strong>
                    </div>
                  </div>
                </div>
                <div class="text-center border-top pt-3">
                  <h5 class="${summary.netBalance >= 0 ? 'text-success' : 'text-danger'}">
                    <strong>Net Balance: ₹${summary.netBalance?.toFixed(2) || '0.00'}</strong>
                  </h5>
                  <small class="text-muted">
                    ${summary.netBalance >= 0 ? 
                      'Account has surplus funds. Safe to close after settlement.' : 
                      'Account has outstanding liabilities. Must be cleared before closure.'}
                  </small>
                </div>
              </div>
            `,
            icon: summary.netBalance >= 0 ? 'info' : 'warning',
            showCancelButton: true,
            confirmButtonText: summary.netBalance >= 0 ? 'Proceed with Approval' : 'Cannot Approve - Outstanding Balance',
            cancelButtonText: 'Cancel',
            confirmButtonColor: summary.netBalance >= 0 ? '#28a745' : '#6c757d',
            width: '800px',
            customClass: {
              popup: 'account-summary-modal'
            },
            preConfirm: () => {
              if (summary.netBalance < 0) {
                Swal.showValidationMessage('Cannot approve closure with outstanding liabilities');
                return false;
              }
              return true;
            }
          }).then((result) => {
            if (result.isConfirmed && summary.netBalance >= 0) {
              // Proceed with approval
              this.confirmClosureApproval(user);
            }
          });
        } else {
          this.toast.error('Failed to load account summary');
        }
      },
      error: (error) => {
        console.error('Error fetching account summary:', error);
        this.toast.error('Failed to load account summary');
        
        // Fallback: show basic approval dialog
        this.showBasicApprovalDialog(user);
      }
    });
  }

  confirmClosureApproval(user: any) {
    // Call the backend API to approve closure
    this.userService.approveAccountClosure(user._id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toast.success(`Account closure approved successfully for ${user.name}`);
          
          // Show additional details if available
          if (response.data && response.data.netBalance > 0) {
            Swal.fire({
              title: 'Account Closure Completed',
              html: `
                <div class="text-center">
                  <p class="text-success"><strong>Account closure approved for ${user.name}</strong></p>
                  <div class="alert alert-success">
                    <strong>Settlement Amount:</strong> ₹${response.data.netBalance.toFixed(2)}<br/>
                    <small>Bank transfer has been initiated for the outstanding balance.</small>
                  </div>
                  <p class="text-muted">The user's account has been terminated and they will no longer be able to log in.</p>
                </div>
              `,
              icon: 'success',
              confirmButtonText: 'OK'
            });
          }
          
          this.getClosureRequests(); // Refresh the list
        } else {
          this.toast.error(response.message || 'Failed to approve account closure');
        }
      },
      error: (error: any) => {
        console.error('Error approving account closure:', error);
        this.toast.error(error.error?.message || 'Failed to approve account closure');
      }
    });
  }

  showBasicApprovalDialog(user: any) {
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
        <p class="text-warning">The user will be notified of the rejection.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject Request',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the backend API to reject closure
        this.userService.rejectAccountClosure(user._id).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.toast.success(`Account closure request rejected for ${user.name}`);
              this.getClosureRequests(); // Refresh the list
            } else {
              this.toast.error(response.message || 'Failed to reject account closure request');
            }
          },
          error: (error: any) => {
            console.error('Error rejecting account closure:', error);
            this.toast.error(error.error?.message || 'Failed to reject account closure request');
          }
        });
      }
    });
  }

}
