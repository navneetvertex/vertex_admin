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
      this.search();
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
      _id: new FormControl(null),
      status: new FormControl(''),
      interest_rate: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      requested_loan_amount: new FormControl({value: '', disabled: true}),
      approved_loan_amount: new FormControl(null, [Validators.min(0)]),
      start_date: new FormControl(null),
      penalty: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      franchise_refer_per: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      direct_refer_per: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      indirect_refer_per: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      rejected_reason: new FormControl(''),
    });

    // if status = Rejected then rejected_reason is required
    // if status = Pending then remaining field is required 

    this.statusFormGroup.get('status')?.valueChanges.subscribe(status => {
      console.log(status)
      if (status === 'Rejected') {
        this.statusFormGroup.get('rejected_reason')?.setValidators([Validators.required]);
        this.statusFormGroup.get('rejected_reason')?.updateValueAndValidity();
      } else {
        this.statusFormGroup.get('rejected_reason')?.clearValidators();
        this.statusFormGroup.get('interest_rate')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.statusFormGroup.get('approved_loan_amount')?.setValidators([Validators.required, Validators.min(0)]);
        this.statusFormGroup.get('start_date')?.setValidators([Validators.required]);
        this.statusFormGroup.get('franchise_refer_per')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.statusFormGroup.get('direct_refer_per')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.statusFormGroup.get('indirect_refer_per')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        ['interest_rate', 'approved_loan_amount', 'start_date', 'franchise_refer_per', 'direct_refer_per', 'indirect_refer_per'].forEach(field => {
          this.statusFormGroup.get(field)?.updateValueAndValidity();
        });
      }
      
    });

    this.searchFormGroup = new FormGroup({
      name: new FormControl(''),
      loan_type: new FormControl(this.loanType),
      status: new FormControl('Pending'),
      interval: new FormControl(''),
    });

    this.search();

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
      console.log('Form is invalid:', this.statusFormGroup.errors);
      Object.keys(this.statusFormGroup.controls).forEach(key => {
        const control = this.statusFormGroup.get(key);
        if (control && control.invalid) {
          console.log(`Control "${key}" is invalid:`, control.errors);
        }
      });
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
    const queryParamArray = [];

    if (this.searchFormGroup && this.searchFormGroup.value) {
      const searchParams = this.searchFormGroup.value;
      Object.keys(searchParams).forEach(key => {
        // Prevent duplicate loan_type
        if (key === 'loan_type') return;
        if (searchParams[key] !== null && searchParams[key] !== '') {
          queryParamArray.push(`${key}=${encodeURIComponent(searchParams[key])}`);
        }
      });
    }

    // Only add loan_type once, from this.loanType
    if (this.loanType) {
      queryParamArray.push(`loan_type=${encodeURIComponent(this.loanType)}`);
    }

    this.queryParams = queryParamArray.join('&');
    this.page = 1; // Reset to first page on new search
    this.getLoanList();
  }

  getLoanList() {
    this.loanService.getLoanList(this.page, this.pageSize, this.queryParams).subscribe({
      next: (res) => {
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
