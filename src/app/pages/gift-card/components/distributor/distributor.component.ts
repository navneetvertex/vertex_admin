import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GiftService } from 'src/app/core/services/gift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.scss']
})
export class DistributorComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private giftService: GiftService,
    private toast: ToastrService
  ) { }

  breadCrumbItems: Array<{}>;
  addDistrubutorForm: FormGroup;
  distributorList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Gift Card Management' }, { label: 'Distributor', active: true }];

    this.addDistrubutorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.loadDistributors();
  }

  loadDistributors() {
    this.isLoading = true;
    this.giftService.getDistributors(this.page, this.pageSize, this.searchText).subscribe(
      (res: any) => {
        if (res && res.status === 'success') {
          this.distributorList = res.data.distributors || [];
          this.total = res.data.total || 0;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading distributors:', error);
        this.toast.error('Failed to load distributors', 'Error');
        this.isLoading = false;
      }
    );
  }

  openModal(content: any) {
    this.modalService.open(content, {backdrop: 'static', keyboard: false, size: 'lg'});
  }

  createDistrubutor() {
    if (this.addDistrubutorForm.valid) {
      const payload = this.addDistrubutorForm.value;

      this.giftService.createDistributor(payload).subscribe(
        (res: any) => {
          if (res && res.status === 'success') {
            this.toast.success('Distributor created successfully', 'Success');
            this.addDistrubutorForm.reset();
            this.modalService.dismissAll();
            this.loadDistributors();
          }
        },
        (error) => {
          console.error('Error creating distributor:', error);
          const errorMessage = error.error?.message || 'Failed to create distributor';
          this.toast.error(errorMessage, 'Error');
        }
      );
    } else {
      this.addDistrubutorForm.markAllAsTouched();
    }
  }

  deleteDistributor(distributorId: string, distributorName: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete distributor "${distributorName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.giftService.deleteDistributor(distributorId).subscribe(
          (res: any) => {
            this.toast.success('Distributor deleted successfully', 'Success');
            this.loadDistributors();
          },
          (error) => {
            console.error('Error deleting distributor:', error);
            this.toast.error('Failed to delete distributor', 'Error');
          }
        );
      }
    });
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.page = 1;
    this.loadDistributors();
  }

  pageChanged(event: any) {
    this.page = event;
    this.loadDistributors();
  }

}
