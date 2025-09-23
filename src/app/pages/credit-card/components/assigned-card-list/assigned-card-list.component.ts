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
  penaltyActionFormGroup: FormGroup;
  cc_selected: any = null;
  limitHistory: any[] = [];
  limitHistoryLoading: boolean = false;

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
    this.penaltyActionFormGroup = new FormGroup({
      penalty_removed: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
      admin_response: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] })
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

  hasPenaltyRequest(card: any): boolean {
    return card.has_pending_penalty_request || false;
  }

  getPenaltyRequestForCard(card: any) {
    return card.penalty_removal_requests && card.penalty_removal_requests.length > 0 
      ? card.penalty_removal_requests[0] 
      : null;
  }

  approvePenaltyRequest(content: any, card: any) {
    const penaltyRequest = this.getPenaltyRequestForCard(card);
    if (penaltyRequest) {
      this.cc_selected = card;
      this.penaltyActionFormGroup.reset();
      this.modalService.open(content, { backdrop: 'static' });
    }
  }

  rejectPenaltyRequest(content: any, card: any) {
    const penaltyRequest = this.getPenaltyRequestForCard(card);
    if (penaltyRequest) {
      this.cc_selected = card;
      this.penaltyActionFormGroup.reset();
      this.modalService.open(content, { backdrop: 'static' });
    }
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

  approvePenaltyRemovalRequest() {
    if (this.penaltyActionFormGroup.get('penalty_removed')?.invalid) {
      this.toast.error('Please enter a valid penalty amount.');
      return;
    }

    const penaltyRequest = this.getPenaltyRequestForCard(this.cc_selected);
    if (!penaltyRequest) {
      this.toast.error('No penalty request found.');
      return;
    }

    const penaltyRemoved = this.penaltyActionFormGroup.get('penalty_removed')?.value;

    this.creditCardService.approvePenaltyRemovalRequest(penaltyRequest._id, penaltyRemoved).subscribe({
      next: (response: any) => {
        this.toast.success('Penalty removal request approved successfully.');
        this.modalService.dismissAll();
        this.getAssignedCreditCard();
      },
      error: (error) => {
        console.error('Error approving penalty removal request:', error);
        this.toast.error('Failed to approve penalty removal request. Please try again.');
      }
    });
  }

  rejectPenaltyRemovalRequest() {
    if (this.penaltyActionFormGroup.get('admin_response')?.invalid) {
      this.toast.error('Please provide a reason for rejection.');
      return;
    }

    const penaltyRequest = this.getPenaltyRequestForCard(this.cc_selected);
    if (!penaltyRequest) {
      this.toast.error('No penalty request found.');
      return;
    }

    const adminResponse = this.penaltyActionFormGroup.get('admin_response')?.value;

    this.creditCardService.rejectPenaltyRemovalRequest(penaltyRequest._id, adminResponse).subscribe({
      next: (response: any) => {
        this.toast.success('Penalty removal request rejected successfully.');
        this.modalService.dismissAll();
        this.getAssignedCreditCard();
      },
      error: (error) => {
        console.error('Error rejecting penalty removal request:', error);
        this.toast.error('Failed to reject penalty removal request. Please try again.');
      }
    });
  }

  showCreditLimitHistory(content: any, cc: any) {
    this.cc_selected = cc;
    this.modalService.open(content, { size: 'lg' });
    this.getCreditLimitHistoryByCard();
  }

  getCreditLimitHistoryByCard() {
    this.limitHistoryLoading = true;
    this.creditCardService.getCreditLimitHistory(this.cc_selected._id).subscribe({
      next: (response: any) => {
        this.limitHistory = response.data.history || [];
        this.limitHistoryLoading = false;
      },
      error: (error) => {
        console.error('Error fetching credit limit history:', error);
        this.toast.error('Failed to load credit limit history.');
        this.limitHistoryLoading = false;
      }
    });
  }

  getChangeTypeIcon(changeType: string): string {
    return changeType === 'Increase' ? 'bx bx-trending-up text-success' : 'bx bx-trending-down text-danger';
  }

}
