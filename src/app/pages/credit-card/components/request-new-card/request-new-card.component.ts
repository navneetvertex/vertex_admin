import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreditCardService } from 'src/app/core/services/credit-card.service';

@Component({
  selector: 'app-request-new-card',
  templateUrl: './request-new-card.component.html',
  styleUrls: ['./request-new-card.component.scss']
})
export class RequestNewCardComponent implements OnInit {

  constructor(private creditCardService: CreditCardService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }
  breadCrumbItems: Array<{}>;
  ccList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  approveCCFormGroup: FormGroup;
  rejectCCFormGroup: FormGroup;
  cc_selected: any = null;
  minDate: string;
  maxDate: string;


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Credit Management' }, { label: 'Request for new card', active: true }];
    this.getRequestedCreditCard();

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
    this.maxDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    this.approveCCFormGroup = new FormGroup({
      approved_credit_limit: new FormControl({value: '1200', disabled: true}, { nonNullable: true, validators: [Validators.required, Validators.min(100)] }),
      interest_rate: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(100)] }),
      penalty: new FormControl(null, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
      start_date: new FormControl(null, { nonNullable: true, validators: [Validators.required] })
    });

    this.rejectCCFormGroup = new FormGroup({
      reason: new FormControl(null, { nonNullable: true, validators: [Validators.required , Validators.minLength(10)] }),
      status: new FormControl('Rejected', { nonNullable: true, validators: [Validators.required] })
    });

  }

  getRequestedCreditCard() {
    this.creditCardService.getRequestedCreditCard(this.page, this.pageSize, this.searchText).subscribe({
      next: (response : any) => {
        this.total = response?.data?.total || 0;
        this.ccList = response?.data?.cc || [];
      },
      error: (error) => {
        console.error('Error fetching requested credit card:', error);
      }
    });
  }

  approveCC() {
    if (this.approveCCFormGroup.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }
    const formData = this.approveCCFormGroup.value;
    const data = {
      _id: this.cc_selected._id,
      approved_credit_limit: 1200,
      interest_rate: formData.interest_rate,
      start_date: formData.start_date
    };
    this.creditCardService.approveCreditCard(data._id, data).subscribe({
      next: (response: any) => {
        this.toast.success('Credit card approved successfully.');
        this.modalService.dismissAll();
        this.getRequestedCreditCard();
      },
      error: (error) => {
        console.error('Error approving credit card:', error);
        this.toast.error('Failed to approve credit card. Please try again.');
      }
    });
  }

  approveCreditCard(content: any, cc: any) {
    this.cc_selected = cc;
    this.approveCCFormGroup.reset();
    this.modalService.open(content, { backdrop: 'static' });
  }

  rejectCreditCardModal(content: any, cc: any) {
    this.cc_selected = cc;
    this.modalService.open(content, { backdrop: 'static' });
  }

  search(val: any) {
    this.searchText = val;
    this.page = 1;
    this.getRequestedCreditCard();
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
        this.getRequestedCreditCard();
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
    this.getRequestedCreditCard();
  }

}
