import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreditCardService } from 'src/app/core/services/credit-card.service';
import { PinsService } from 'src/app/core/services/pins.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, AfterViewInit {

  constructor(private modalService: NgbModal,
      private toast: ToastrService,
      private creditCardService: CreditCardService,
      private userService: UserProfileService ,
      private pinService: PinsService
    ) { }
    breadCrumbItems: Array<{}>;
    addPinFormGroup : FormGroup
    assignFormGroup: FormGroup;
    searchTerm: string = '';
  
    userIDText: string = '';
    userDetails: any = null;
  
    pinList: any[] = []
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
  
    userList: any[] = [];

    // Date range picker configuration
    dateRangeOptions: any = {
      mode: 'range',
      dateFormat: 'Y-m-d',
      maxDate: new Date(),
      defaultDate: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()], // Last 30 days
      placeholder: 'Select date range for export',
      allowInput: true,
      onChange: (selectedDates: any, dateStr: any, instance: any) => {
        if (selectedDates.length === 2) {
          this.selectedDateRange = selectedDates;
        }
      }
    };
    selectedDateRange: Date[] = [];
    dateRangePicker: any;
    exportLoading: boolean = false;
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Card List Management' }, { label: 'Manage', active: true }];
      this.addPinFormGroup = new FormGroup({
        no_of_pins: new FormControl('', Validators.required),
      });

      this.assignFormGroup = new FormGroup({
        assign_to: new FormControl('' , Validators.required),
      });
      this.getPins();
    }

    ngAfterViewInit() {
      // Initialize date range picker after view is initialized
      const dateRangeElement = document.getElementById('dateRangePicker');
      if (dateRangeElement) {
        this.dateRangePicker = flatpickr(dateRangeElement, this.dateRangeOptions);
      }
    }    getUserDetails() {
      if (!this.userIDText) {
        this.userDetails = null;
        return;
      }
      this.userService.getBasicUserProfile(this.userIDText).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.userDetails = res?.data?.user;
            if(!this.userDetails) {
              this.assignFormGroup.get('assign_to')?.setErrors({ 'userNotFound': true });
            }
          } 
        }, error: (err) => {
          console.error('Error fetching user details:', err);
        }
      });
    }
  
   
  
    openModal(content: any) {
      this.modalService.open(content);
    }
  
    getPins() {
      this.creditCardService.getCreditCardNumberList(this.page, this.pageSize, this.searchTerm).subscribe((res: any) => {
        if (res && res.data) {
          this.pinList = res?.data?.cardNumbers || [];
          this.total = res?.data?.total || 0;
        } else {
          this.pinList = [];
        }
      }, (err: any) => {
        console.error('Error fetching pin list:', err);
        this.pinList = [];
      });
    }
  
    onSearch(event: any) {
      this.searchTerm = event.target.value.toLowerCase();
      this.page = 1;
      this.getPins();
    }
  
  
    pinSelected : any[] = []
    pinChecked(event: any) {
      if(event.target.checked) {
        this.pinSelected.push(event.target.value);
      }
      else {
        this.pinSelected = this.pinSelected.filter((pin: any) => pin !== event.target.value);
      }
      console.log('Selected Pins:', this.pinSelected);
    }
    
  
    findPageShowing(): number {
      return Math.min(this.page * this.pageSize, this.total)
    }
  
    pageChange(page: number) {
      this.page = page;
      this.getPins();
    }

    exportCardList() {
      if (this.selectedDateRange.length !== 2) {
        this.toast.error('Please select a valid date range for export');
        return;
      }

      this.exportLoading = true;
      const startDate = this.formatDate(this.selectedDateRange[0]);
      const endDate = this.formatDate(this.selectedDateRange[1]);

      this.creditCardService.exportCardList(startDate, endDate).subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `card_list_${startDate}_to_${endDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toast.success('Card list exported successfully');
        this.exportLoading = false;
      }, (err: any) => {
        console.error('Error exporting card list:', err);
        this.toast.error('Failed to export card list');
        this.exportLoading = false;
      });
    }

    private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    createPins() {
      if (this.addPinFormGroup.invalid) {
        this.toast.error('Please fill all required fields');
        return;
      }
      this.creditCardService.generateCreditCardNumber(this.addPinFormGroup.value.no_of_pins).subscribe({
        next: (res: any) => {
          this.toast.success('Sahyog Card no created successfully');
          this.addPinFormGroup.reset();
          this.getPins();
          this.modalService.dismissAll();
        }
        , error: (err: any) => {  
          this.toast.error('Failed to create pins');
        }
      });
    }
  
    assignPins() {
      if (this.assignFormGroup.invalid || this.pinSelected.length === 0) {
        this.toast.error('Please select pins and assign to a user');
        return;
      }
      const payload = {
        assign_to: this.userDetails?._id,
        pins: this.pinSelected
      };
      this.pinService.assignPins(payload).subscribe({
        next: (res: any) => {
          this.toast.success('Pins assigned successfully');
          this.assignFormGroup.reset();
          this.pinSelected = [];
          this.modalService.dismissAll();
          this.getPins();
        },
        error: (err: any) => {
          this.toast.error('Failed to assign pins');
        }
      });
    }
  
    disablePin(pin: string) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to disable this pin?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, disable it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.pinService.inactivePin(pin, {status: 'Inactive'}).subscribe({
            next: (res: any) => {
              this.getPins();
              this.toast.success('Pin disabled successfully');
              this.modalService.dismissAll();
            },
            error: (err: any) => {
              this.toast.error('Failed to disable pin');
            }
          });
          
        }
      });
    }
  
    enablePin(pin: string) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to enable this pin?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, enable it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.pinService.inactivePin(pin, {status: 'Active'}).subscribe({
            next: (res: any) => {
              this.getPins();
              this.toast.success('Pin disabled successfully');
              this.modalService.dismissAll();
            },
            error: (err: any) => {
              this.toast.error('Failed to disable pin');
            }
          });
          
        }
      });
    }

}
