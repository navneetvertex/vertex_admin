import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubadminService } from 'src/app/core/services/subadmin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subadmin-list',
  templateUrl: './subadmin-list.component.html',
  styleUrls: ['./subadmin-list.component.scss']
})
export class SubadminListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  searchFormGroup: FormGroup;
  subAdminList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  statusList: any[] = ['Pending', 'Active', 'Inactive', 'Blocked'];
  currStatus: string = 'Active';
  currSubAdminId: string = '';
  Math = Math; // For template usage

  constructor(
    private subadminService: SubadminService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Sub-Admin Management' },
      { label: 'Sub-Admin List', active: true }
    ];

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      user_id: new FormControl(''),
      status: new FormControl('')
    });

    this.getAllSubAdmins();
  }

  getAllSubAdmins() {
    const params = {
      page: this.page,
      limit: this.pageSize,
      ...this.searchFormGroup.value
    };

    this.subadminService.getSubAdmins(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.subAdminList = res.data;
          this.total = res.total;
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to fetch sub-admins', 'Error');
      }
    });
  }

  search() {
    this.page = 1;
    this.getAllSubAdmins();
  }

  reset() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.getAllSubAdmins();
  }

  onPageChange(page: number) {
    this.page = page;
    this.getAllSubAdmins();
  }

  editSubAdmin(id: string) {
    this.router.navigate(['/subadmin/edit', id]);
  }

  managePermissions(id: string) {
    this.router.navigate(['/subadmin/permissions', id]);
  }

  openStatusModal(content: any, subAdminId: string, currentStatus: string) {
    this.currSubAdminId = subAdminId;
    this.currStatus = currentStatus;
    this.modalService.open(content, { centered: true });
  }

  changeStatus() {
    this.subadminService.changeSubAdminStatus(this.currSubAdminId, this.currStatus).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toast.success('Status updated successfully', 'Success');
          this.getAllSubAdmins();
          this.modalService.dismissAll();
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to update status', 'Error');
      }
    });
  }

  deleteSubAdmin(id: string, name: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${name}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subadminService.deleteSubAdmin(id).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toast.success('Sub-admin deleted successfully', 'Success');
              this.getAllSubAdmins();
              Swal.fire('Deleted!', 'Sub-admin has been deleted.', 'success');
            }
          },
          error: (err) => {
            this.toast.error(err.error?.message || 'Failed to delete sub-admin', 'Error');
          }
        });
      }
    });
  }

  updatePassword(id: string, name: string) {
    Swal.fire({
      title: 'Update Password',
      html: `
        <p class="mb-3">Enter new password for <strong>${name}</strong></p>
        <input type="password" id="newPassword" class="swal2-input" placeholder="New Password" minlength="8">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm Password" minlength="8">
        <small class="text-muted d-block mt-2">Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</small>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update Password',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#667eea',
      preConfirm: () => {
        const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please enter both password fields');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Passwords do not match');
          return false;
        }

        if (newPassword.length < 8) {
          Swal.showValidationMessage('Password must be at least 8 characters');
          return false;
        }

        return { password: newPassword };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.subadminService.updateSubAdminPassword(id, result.value.password).subscribe({
          next: (res: any) => {
            if (res.success) {
              Swal.fire('Success!', 'Password updated successfully', 'success');
            }
          },
          error: (err) => {
            this.toast.error(err.error?.message || 'Failed to update password', 'Error');
          }
        });
      }
    });
  }
}
