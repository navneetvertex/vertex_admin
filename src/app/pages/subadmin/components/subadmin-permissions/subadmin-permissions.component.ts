import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubadminService } from 'src/app/core/services/subadmin.service';

@Component({
  selector: 'app-subadmin-permissions',
  templateUrl: './subadmin-permissions.component.html',
  styleUrls: ['./subadmin-permissions.component.scss']
})
export class SubadminPermissionsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  subAdminId: string | null = null;
  subAdminName: string = '';
  loading = true;

  permissions: any = {
    dashboard: true,
    members: {
      view: false,
      kyc: false,
      accountClosure: false
    },
    advisors: {
      view: false,
      manage: false
    },
    franchises: {
      view: false,
      manage: false
    },
    deposits: {
      compulsory: false,
      recurring: false,
      fixed: false
    },
    pinManagement: {
      add: false,
      assigned: false,
      fund: false
    },
    messages: false,
    sahyogCard: {
      cardList: false,
      requestNew: false,
      assignedCards: false,
      requestAmounts: false,
      payableAmount: false,
      transactions: false,
      reports: false
    },
    giftCard: {
      add: false,
      list: false,
      distributor: false,
      receive: false
    },
    loanManagement: {
      personalLoans: false,
      guaranteedLoans: false,
      fdAgainstLoans: false,
      payLoan: false,
      userTransactions: false,
      adminTransactions: false,
      reports: false
    },
    shg: false,
    careers: false,
    awards: false,
    settings: {
      general: false,
      fees: false
    },
    stateManagement: {
      states: false,
      districts: false,
      areas: false
    },
    paymentManagement: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subadminService: SubadminService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.subAdminId = this.route.snapshot.paramMap.get('id');

    if (!this.subAdminId) {
      this.toast.error('Invalid sub-admin ID', 'Error');
      this.router.navigate(['/subadmin/list']);
      return;
    }

    this.breadCrumbItems = [
      { label: 'Sub-Admin Management' },
      { label: 'Manage Permissions', active: true }
    ];

    this.loadSubAdminData();
    this.loadPermissions();
  }

  loadSubAdminData() {
    this.subadminService.getSubAdmin(this.subAdminId!).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.subAdminName = res.data.name;
        }
      },
      error: (err) => {
        console.error('Error loading sub-admin:', err);
      }
    });
  }

  loadPermissions() {
    this.loading = true;
    this.subadminService.getSubAdminPermissions(this.subAdminId!).subscribe({
      next: (res: any) => {
        if (res.success && res.data?.permissions) {
          this.permissions = { ...this.permissions, ...res.data.permissions };
        }
        this.loading = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to load permissions', 'Error');
        this.loading = false;
      }
    });
  }

  toggleAll(module: string, value: boolean) {
    if (typeof this.permissions[module] === 'object' && !Array.isArray(this.permissions[module])) {
      Object.keys(this.permissions[module]).forEach(key => {
        this.permissions[module][key] = value;
      });
    }
  }

  isAllSelected(module: string): boolean {
    if (typeof this.permissions[module] === 'object' && !Array.isArray(this.permissions[module])) {
      return Object.values(this.permissions[module]).every(val => val === true);
    }
    return false;
  }

  isAnySelected(module: string): boolean {
    if (typeof this.permissions[module] === 'object' && !Array.isArray(this.permissions[module])) {
      return Object.values(this.permissions[module]).some(val => val === true);
    }
    return false;
  }

  savePermissions() {
    this.subadminService.updateSubAdminPermissions(this.subAdminId!, this.permissions).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success('Permissions updated successfully', 'Success');
          this.router.navigate(['/subadmin/list']);
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to update permissions', 'Error');
      }
    });
  }

  cancel() {
    this.router.navigate(['/subadmin/list']);
  }
}
