import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreditCardService } from 'src/app/core/services/credit-card.service';

@Component({
  selector: 'app-assigned-card-list',
  templateUrl: './assigned-card-list.component.html',
  styleUrls: ['./assigned-card-list.component.scss']
})
export class AssignedCardListComponent implements OnInit {

  constructor(private creditCardService: CreditCardService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  currentYear: number = new Date().getFullYear();
  ccList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  rejectCCFormGroup: FormGroup;
  increaseCCFormGroup: FormGroup;
  cc_selected: any = null;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Assigned Card', active: true }];
    this.getAssignedCreditCard();
    this.rejectCCFormGroup = new FormGroup({
      reason: new FormControl(null, { nonNullable: true, validators: [Validators.required , Validators.minLength(10)] }),
      status: new FormControl('Rejected', { nonNullable: true, validators: [Validators.required] })
    });
    this.increaseCCFormGroup = new FormGroup({
      approved_credit_limit: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(500)] })
    });
  }

  getAssignedCreditCard() {
    this.creditCardService.getAssignedCreditCard(this.page, this.pageSize, this.searchText).subscribe({
      next: (response : any) => {
        this.total = response?.data?.total || 0;
        this.ccList = response?.data?.cc || [];
        console.log('Assigned Credit Cards:', this.ccList);
      },
      error: (error) => {
        console.error('Error fetching requested credit card:', error);
      }
    });
  }

  increaseCCLimit(content: any, cc: any) {
    this.cc_selected = cc;
    this.increaseCCFormGroup.reset();
    this.modalService.open(content, { backdrop: 'static' });
  }

  rejectCreditCardModal(content: any, cc: any) {
    this.cc_selected = cc;
    this.modalService.open(content, { backdrop: 'static' });
  }

  search(val: any) {
    this.searchText = val;
    this.page = 1;
    this.getAssignedCreditCard();
  }

  rejectCreditCard() {

    if( this.rejectCCFormGroup.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    const formData = this.rejectCCFormGroup.value;

    console.log('Rejecting credit card with data:', formData);

    this.creditCardService.rejectCreditCard(this.cc_selected._id, formData).subscribe({
      next: (response: any) => {
        this.toast.success('Credit card rejected successfully.');
        this.modalService.dismissAll();
        this.getAssignedCreditCard();
      },
      error: (error) => {
        console.error('Error rejecting credit card:', error);
        this.toast.error('Failed to reject credit card. Please try again.');
      }
    });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getAssignedCreditCard();
  }

  increaseCreditCardLimit() {
    if (this.increaseCCFormGroup.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    const formData = this.increaseCCFormGroup.value;

    console.log('Increasing credit card limit with data:', formData);

    this.creditCardService.increaseCreditCardLimit(this.cc_selected._id, formData).subscribe({
      next: (response: any) => {
        this.toast.success('Credit card limit increased successfully.');
        this.modalService.dismissAll();
        this.getAssignedCreditCard();
      },
      error: (error) => {
        console.error('Error increasing credit card limit:', error);
        this.toast.error('Failed to increase credit card limit. Please try again.');
      }
    });
  }

}
