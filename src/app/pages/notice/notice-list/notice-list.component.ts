import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NoticeService } from 'src/app/core/services/notice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  notices: any[] = [];
  loading = false;

  noticeForm: FormGroup;
  isEditing = false;
  editingId: string | null = null;

  constructor(
    private noticeService: NoticeService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Masters' }, { label: 'Notices', active: true }];

    this.noticeForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      status: new FormControl(true)
    });

    this.loadNotices();
  }

  loadNotices() {
    this.loading = true;
    this.noticeService.getAllNotices().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.notices = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.toast.error('Failed to load notices');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.noticeForm.invalid) {
      this.noticeForm.markAllAsTouched();
      return;
    }

    const data = this.noticeForm.value;

    if (this.isEditing && this.editingId) {
      this.noticeService.updateNotice(this.editingId, data).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toast.success('Notice updated successfully');
            this.resetForm();
            this.loadNotices();
          }
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to update notice');
        }
      });
    } else {
      this.noticeService.createNotice(data).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toast.success('Notice created successfully');
            this.resetForm();
            this.loadNotices();
          }
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to create notice');
        }
      });
    }
  }

  editNotice(notice: any) {
    this.isEditing = true;
    this.editingId = notice._id;
    this.noticeForm.patchValue({
      title: notice.title,
      status: notice.status
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.noticeForm.reset({ title: '', status: true });
  }

  toggleStatus(notice: any) {
    this.noticeService.toggleNoticeStatus(notice._id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.success(res.message);
          this.loadNotices();
        }
      },
      error: (err) => {
        this.toast.error('Failed to toggle status');
      }
    });
  }

  deleteNotice(notice: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this notice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticeService.deleteNotice(notice._id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.toast.success('Notice deleted successfully');
              this.loadNotices();
            }
          },
          error: (err) => {
            this.toast.error('Failed to delete notice');
          }
        });
      }
    });
  }
}
