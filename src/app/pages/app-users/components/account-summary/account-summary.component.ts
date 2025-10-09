import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss']
})
export class AccountSummaryComponent implements OnInit {

  accountSummary: any = null;
  loading: boolean = true;
  error: string = '';
  userId: string = '';
  userDetails: any = null;
  breadCrumbItems: Array<{}>;
  Math = Math; // Expose Math to template

  constructor(
    private route: ActivatedRoute,
    private userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['user'];
      if (this.userId) {
        this.breadCrumbItems = [
          { label: 'Members' },
          { label: 'All Users', link: '/members/all' },
          { label: 'Account Summary', active: true }
        ];
        this.getAccountSummary();
        this.getUserDetails();
      } else {
        this.error = 'User ID not found in URL';
        this.loading = false;
      }
    });
  }

  getAccountSummary() {
    this.loading = true;
    this.userService.getAccountSummary(this.userId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.accountSummary = response.data;
        } else {
          this.error = 'Failed to load account summary';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching account summary:', error);
        this.error = 'Failed to load account summary. Please try again.';
        this.loading = false;
      }
    });
  }

  getUserDetails() {
    // Get user details from the account summary or fetch separately
    // For now, we'll get it from the account summary response
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'inactive':
        return 'badge bg-warning';
      case 'pending':
        return 'badge bg-info';
      case 'blocked':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

}
