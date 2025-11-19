import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PinsService } from 'src/app/core/services/pins.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fund-pin',
  templateUrl: './fund-pin.component.html',
  styleUrls: ['./fund-pin.component.scss']
})
export class FundPinComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private toast: ToastrService,
    private userService: UserProfileService,
    private pinService: PinsService
  ) { }

  breadCrumbItems: Array<{}>;
  createFundPinForm: FormGroup;
  assignFundPinForm: FormGroup;

  userIDText: string = '';
  userDetails: any = null;

  // Separate properties for create modal
  createUserIDText: string = '';
  createUserDetails: any = null;

  fundPinList: any[] = [];
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedCurrency: string = '';

  userList: any[] = [];
  selectedPins: any[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Pin Management' }, { label: 'Fund Pins', active: true }];

    this.createFundPinForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      currency: new FormControl('INR', Validators.required),
      assign_to: new FormControl(''),
      description: new FormControl(''),
      expiry_date: new FormControl('')
    });

    this.assignFundPinForm = new FormGroup({
      assign_to: new FormControl('', Validators.required),
    });

    this.getAllUsers();
    this.getFundPins();
  }

  getUserDetails() {
    if (!this.userIDText) {
      this.userDetails = null;
      return;
    }
    this.userService.getBasicUserProfile(this.userIDText).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userDetails = res?.data?.user;
          if (!this.userDetails) {
            this.assignFundPinForm.get('assign_to')?.setErrors({ 'userNotFound': true });
          }
        }
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  getCreateUserDetails() {
    if (!this.createUserIDText) {
      this.createUserDetails = null;
      return;
    }
    this.userService.getBasicUserProfile(this.createUserIDText).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.createUserDetails = res?.data?.user;
          if (!this.createUserDetails) {
            this.createFundPinForm.get('assign_to')?.setErrors({ 'userNotFound': true });
          } else {
            this.createFundPinForm.get('assign_to')?.setErrors(null);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.createUserDetails = null;
        this.createFundPinForm.get('assign_to')?.setErrors({ 'userNotFound': true });
      }
    });
  }

  getAllUsers() {
    this.userService.getAllUserIds().subscribe((res: any) => {
      if (res && res.data) {
        this.userList = res.data.users;
      }
    });
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  getFundPins() {
    this.pinService.getFundPins(this.page, this.pageSize, this.searchTerm, this.selectedStatus, this.selectedCurrency)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.fundPinList = res?.data?.fundPins || [];
          this.total = res?.data?.total || 0;
        } else {
          this.fundPinList = [];
        }
      }, (err: any) => {
        console.error('Error fetching fund pin list:', err);
        this.fundPinList = [];
      });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.page = 1;
    this.getFundPins();
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.page = 1;
    this.getFundPins();
  }

  onCurrencyChange(event: any) {
    this.selectedCurrency = event.target.value;
    this.page = 1;
    this.getFundPins();
  }

  pinSelected(event: any, pin: any) {
    if (event.target.checked) {
      this.selectedPins.push(pin);
    } else {
      this.selectedPins = this.selectedPins.filter((p: any) => p._id !== pin._id);
    }
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  pageChange(page: number) {
    this.page = page;
    this.getFundPins();
  }

  createFundPin() {
    if (this.createFundPinForm.invalid) {
      this.toast.error('Please fill all required fields');
      return;
    }

    const formValue = this.createFundPinForm.value;
    const payload: any = {
      amount: Number(formValue.amount),
      currency: formValue.currency,
      description: formValue.description || ''
    };

    if (formValue.assign_to && this.createUserDetails) {
      payload.assign_to = this.createUserDetails._id;
    }

    if (formValue.expiry_date) {
      payload.expiry_date = formValue.expiry_date;
    }

    this.pinService.createFundPin(payload).subscribe({
      next: (res: any) => {
        this.toast.success('Fund PIN created successfully');
        this.createFundPinForm.reset();
        this.createFundPinForm.patchValue({ currency: 'INR' });
        this.createUserIDText = '';
        this.createUserDetails = null;
        this.getFundPins();
        this.modalService.dismissAll();
      },
      error: (err: any) => {
        this.toast.error('Failed to create fund PIN');
      }
    });
  }

  assignFundPins() {
    if (this.assignFundPinForm.invalid || this.selectedPins.length === 0) {
      this.toast.error('Please select fund PINs and assign to a user');
      return;
    }

    const payload = {
      assign_to: this.userDetails._id,
      pin_ids: this.selectedPins.map(pin => pin._id)
    };

    this.pinService.assignFundPins(payload).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Fund PINs assigned successfully');
        this.assignFundPinForm.reset();
        this.selectedPins = [];
        this.userDetails = null;
        this.userIDText = '';
        this.getFundPins();
        this.modalService.dismissAll();
      },
      error: (err: any) => {
        this.toast.error('Failed to assign fund PINs');
        console.error('Error assigning fund pins:', err);
      }
    });
  }

  deleteFundPin(pin: any) {
    if (pin.used_by) {
      this.toast.error('Cannot delete a fund PIN that has been used');
      return;
    }

    Swal.fire({
      title: 'Delete Fund PIN',
      text: `Are you sure you want to delete this fund PIN worth ${pin.currency} ${pin.amount}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pinService.deleteFundPin(pin._id).subscribe({
          next: (res: any) => {
            this.toast.success('Fund PIN deleted successfully');
            this.getFundPins();
          },
          error: (err: any) => {
            this.toast.error('Failed to delete fund PIN');
          }
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge-soft-primary';
      case 'Assigned': return 'badge-soft-success';
      case 'Used': return 'badge-soft-info';
      case 'Inactive': return 'badge-soft-danger';
      case 'Hold': return 'badge-soft-warning';
      case 'Transferred': return 'badge-soft-warning';
      case 'Expired': return 'badge-soft-secondary';
      default: return 'badge-soft-light';
    }
  }
}
