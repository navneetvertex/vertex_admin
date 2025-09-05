import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCropperComponent } from 'src/app/pages/app-users/components/edit-profile/image-cropper/image-cropper.component';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-loan-requested',
  templateUrl: './loan-requested.component.html',
  styleUrls: ['./loan-requested.component.scss']
})         
export class LoanRequestedComponent implements OnInit {

  constructor(private loanService: LoanService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private router: Router
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
  maxDate: string;
  LoanTable : any[] = [];
  LoanTotal: any = null;
  queryParams: string = '';
  status = ['Pending', 'Approved', 'Rejected', 'Completed', 'Defaulted']
  loanSelected: any = null;

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loans' }, { label: 'Requested Loan', active: true }];
    
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
    
    // Set max date to today + 5 days
    const maxSelectableDate = new Date(now);
    maxSelectableDate.setDate(now.getDate() + 5);
    this.maxDate = maxSelectableDate.toISOString().split('T')[0];

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
      cheque_proof: new FormControl(''),
    });


    
    

    // if status = Rejected then rejected_reason is required
    // if status = Pending then remaining field is required 

    this.statusFormGroup.get('status')?.valueChanges.subscribe(status => {
      if (status === 'Rejected') {
        this.statusFormGroup.get('rejected_reason')?.setValidators([Validators.required]);
        ['interest_rate', 'approved_loan_amount', 'start_date', 'franchise_refer_per', 'direct_refer_per', 'indirect_refer_per'].forEach(field => {
          const control = this.statusFormGroup.get(field);
          if (control) {
            const validators = control.validator ? [Validators.min(0), Validators.max(100)].filter(v => field !== 'approved_loan_amount' && field !== 'start_date') : [];
            if (field === 'approved_loan_amount') {
              control.setValidators([Validators.min(0)]);
            } else if (field === 'start_date') {
              control.setValidators([]);
            } else {
              control.setValidators(validators);
            }
            control.updateValueAndValidity();
          }
        });
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
    this.uploadedChequeProof = null;
    this.statusFormGroup.reset();
    this.settingsService.getGeneralSettings$().subscribe(settings => {
        if (settings) {
          if(this.loanType === 'Personal') this.statusFormGroup.patchValue({penalty: settings.loan_penalty || 0, interest_rate: settings.loan_rate || 0, indirect_refer_per: settings.loan_indirect_percentage || 0, direct_refer_per: settings.loan_direct_percentage || 0, franchise_refer_per: settings.loan_francise_percentage || 0});
          if(this.loanType !== 'Personal') this.statusFormGroup.patchValue({penalty: settings.g_loan_penalty || 0, interest_rate: settings.g_loan_rate || 0, indirect_refer_per: settings.g_loan_indirect_percentage || 0, direct_refer_per: settings.g_loan_direct_percentage || 0, franchise_refer_per: settings.g_loan_francise_percentage || 0});
        }
      });
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
        this.settingsService.getGeneralSettings$().subscribe(settings => {
        if (settings) {
          this.statusFormGroup.patchValue({interest_rate: settings.loan_rate || 0, indirect_refer_per: settings.loan_indirect_percentage || 0, direct_refer_per: settings.loan_direct_percentage || 0, franchise_refer_per: settings.loan_francise_percentage || 0});
        }
      });
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

    if (!queryParamArray.some(param => param.startsWith('status='))) {
      queryParamArray.push(`status=Pending`);
    }

    this.queryParams = queryParamArray.join('&');
    this.page = 1; // Reset to first page on new search
    this.getLoanList();
  }

  getLoanList() {
    this.loanService.getLoanList(this.page, this.pageSize, this.queryParams).subscribe({
      next: (res) => {
        this.loanList = res.data.loans;
        console.log('Fetched loan list:', this.loanList);
        this.total = res.data.total;
      },
      error: (err) => {
        console.error('Error fetching loan list:', err);
      }
    });
  }

  document_to : string = null

  viewGuaranteedLoan(content: any, loan: any) {
    this.selectedLoan = loan;

    this.loanService.getLoanSchedule(loan._id).subscribe({
      next: (res) => {
        console.log(res)
        this.LoanTable = res.data.schedule;
        this.LoanTotal = res.data.totals;
        this.loanSelected = loan;
        this.document_to = res.data.loan.cheque_proof || null;
      },
      error: (err) => {
        console.error('Error fetching guaranteed loan schedule:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch guaranteed loan schedule.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
   
    this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

  viewPersonalLoan(content: any, loan: any) {
    this.selectedLoan = loan;

    this.loanService.getPersonalLoanSchedule(loan._id).subscribe({
      next: (res) => {
        
        this.LoanTable = res.data.schedule;
        this.LoanTotal = res.data.totals;
        this.loanSelected = loan;
        this.document_to = res.data.loan.doc || null;
      },
      error: (err) => {
        console.error('Error fetching personal loan schedule:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch personal loan schedule.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
    this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }

  payloan() {
    this.router.navigate(
      ['/loan-management/pay-loan'],
      { queryParams: { id: this.loanSelected._id, user: this.loanSelected?.user.user_id } }
    );
    this.modalService.dismissAll();
  }

  onFileSelected(event: Event, from: string): void {
      const input = event.target as HTMLInputElement;
  
      if (!input.files || input.files.length === 0) {
        return;
      }
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Please select a valid image file.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        input.value = '';
        return;
      }
  
      if (input.files && input.files.length > 0) {
        this.openImageCropper({ file : event, from: from });
      }
  }
  
    openImageCropper(data: any) {
      const modalRef = this.modalService.open(ImageCropperComponent, { centered: true, size: 'xl' });
      modalRef.componentInstance.data = data;
      modalRef.result.then((result) => {
        if(result) {
          if (result.image) {
            const base64 = result.image;
            this.cropAndSetPhoto(base64, result.from);
          }
        }
      }).catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
    }

    uploadedChequeProof: string = '';
  
     cropAndSetPhoto(base64: string, type: string = 'profile_image') {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);

        this.uploadedChequeProof = compressedBase64;
        this.statusFormGroup.patchValue({ cheque_proof: compressedBase64 });
  
        console.log(`Selected ${type}:`);
      };
      img.src = base64;
    }


}
