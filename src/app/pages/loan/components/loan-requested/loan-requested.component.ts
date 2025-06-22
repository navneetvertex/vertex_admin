import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';

@Component({
  selector: 'app-loan-requested',
  templateUrl: './loan-requested.component.html',
  styleUrls: ['./loan-requested.component.scss']
})         
export class LoanRequestedComponent implements OnInit {

  constructor(private loanService: LoanService,
    private modalService: NgbModal
  ) { }

  breadCrumbItems: Array<{}>;
  loanList: any[] = []
  total: number = 0;
  page: number = 1;
  statusFormGroup: FormGroup
  pageSize: number = 10;
  selectedLoan: any;
  searchFormGroup: FormGroup;
  status = ['Pending', 'Approved', 'Rejected', 'Completed', 'Defaulted']

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Requested Loan', active: true }];
    

    this.statusFormGroup = new FormGroup({
      _id: new FormControl(null, Validators.required),
      status: new FormControl('', Validators.required),
      interest_rate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      requested_loan_amount: new FormControl({value: '', disabled: true}),
      approved_loan_amount: new FormControl(null, [Validators.required, Validators.min(0)]),
      start_date: new FormControl(null, Validators.required),
      penalty: new FormControl(null, [Validators.min(0), Validators.max(100)])
    });

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      loan_type: new FormControl(''),
      status: new FormControl('Pending'),
      interval: new FormControl(''),
    });

    this.getLoanList();

  }

  refresh() {
    this.page = 1;
    this.searchFormGroup.reset();
    this.searchFormGroup.patchValue({status: 'Pending', loan_type: '' , name: '', interval: ''});
    this.getLoanList();
  }

  openLoanModal(content: any, loan: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
    this.statusFormGroup.reset();
    this.statusFormGroup.patchValue({
      _id: loan._id,
      status: loan.status,
      requested_loan_amount: loan.requested_loan_amount,
    });
  }

  submit() {
    if (this.statusFormGroup.invalid) {
      return;
    }

    const loanData = {
      ...this.statusFormGroup.value
    };

    this.loanService.updateLoanStatus(loanData._id, loanData).subscribe({
      next: (res) => {
        console.log('Loan status updated successfully:', res);
        this.modalService.dismissAll();
        this.getLoanList();
      },
      error: (err) => {
        console.error('Error updating loan status:', err);
      }
    });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getLoanList();
  }

  getLoanList() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    const queryParams = queryParamArray.join('&');
    
    this.loanService.getLoanList(this.page, this.pageSize, queryParams).subscribe({
      next: (res) => {
        console.log('Loan list fetched successfully:', res);
        this.loanList = res.data.loans;
        this.total = res.data.total;
      },
      error: (err) => {
        console.error('Error fetching loan list:', err);
      }
    });
  }

  viewLoan(content: any, loan: any) {
    this.selectedLoan = loan;
    this.modalService.open(content, { backdrop: 'static' });
  }

}
