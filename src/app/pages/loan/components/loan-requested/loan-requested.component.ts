import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loan-requested',
  templateUrl: './loan-requested.component.html',
  styleUrls: ['./loan-requested.component.scss']
})         
export class LoanRequestedComponent implements OnInit {

  constructor(private loanService: LoanService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.loanType = paramMap.get('type') || '';
      console.log('Plan from route:', this.loanType);
      
    });
   }

  breadCrumbItems: Array<{}>;
  loanList: any[] = []
  total: number = 0;
  loanType: string = '';
  page: number = 1;
  statusFormGroup: FormGroup
  pageSize: number = 10;
  selectedLoan: any;
  searchFormGroup: FormGroup;
  minDate: string;
  queryParams: string = '';
  status = ['Pending', 'Approved', 'Rejected', 'Completed', 'Defaulted']

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Requested Loan', active: true }];
    
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.statusFormGroup = new FormGroup({
      _id: new FormControl(null, Validators.required),
      status: new FormControl('', Validators.required),
      interest_rate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      requested_loan_amount: new FormControl({value: '', disabled: true}),
      approved_loan_amount: new FormControl(null, [Validators.required, Validators.min(0)]),
      start_date: new FormControl(null, Validators.required),
      penalty: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      franchise_refer_per: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      direct_refer_per: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      indirect_refer_per: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    });

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      loan_type: new FormControl(this.loanType),
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
      // status: loan.status,
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
        Swal.fire({
          title: 'Success',
          text: `Loan status updated to ${loanData.status}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.statusFormGroup.reset();
        this.selectedLoan = null;
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

  search() {
    const searchParams = this.searchFormGroup.value;
    const queryParamArray = [];
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== null && searchParams[key] !== '') {
      queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
      }
    });

    this.queryParams = queryParamArray.join('&');
  }

  getLoanList() {
    this.loanService.getLoanList(this.page, this.pageSize, this.queryParams).subscribe({
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
