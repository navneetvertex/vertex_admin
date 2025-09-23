import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/core/services/loan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface LoanReport {
  _id: string;
  loan_id: string;
  loan_type: string;
  status: string;
  requested_loan_amount: number;
  approved_loan_amount: number;
  interest_rate: number;
  interval: string;
  duration: number;
  purpose: string;
  start_date: string;
  created_date: string;
  updated_date: string;
  user: {
    _id: string;
    name: string;
    email: string;
    user_id: string;
    phone: string;
  };
  totalDisbursed: number;
  totalPaid: number;
  totalInterest: number;
  totalPenalties: number;
  totalFees: number;
  totalOutstanding: number;
  totalTransactions: number;
  paymentTransactions: number;
  lastTransactionDate: string;
  firstTransactionDate: string;
  paymentPercentage: number;
  daysSinceLastPayment: number;
}

interface LoanReportSummary {
  totalLoans: number;
  totalDisbursedAmount: number;
  totalOutstandingAmount: number;
  totalPaidAmount: number;
  activeLoans: number;
  pendingLoans: number;
  rejectedLoans: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  
  // Data
  loanReports: LoanReport[] = [];
  summary: LoanReportSummary = {} as LoanReportSummary;
  
  // Pagination
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;
  limit = 20;
  
  // Loading states
  loading = false;
  loadingDetail = false;
  
  // Filters
  filters = {
    search: '',
    status: '',
    loan_type: '',
    loan_id: '',
    name: '',
    email: '',
    user_id: '',
    min_outstanding: '',
    max_outstanding: '',
    start_date: '',
    end_date: '',
    sortBy: 'created_date',
    sortOrder: 'desc'
  };
  
  // Filter options
  statusOptions = ['Pending', 'Approved', 'Rejected', 'Completed'];
  loanTypeOptions = ['Personal', 'Garanteed'];
  sortOptions = [
    { value: 'created_date', label: 'Loan Creation Date' },
    { value: 'userName', label: 'User Name' },
    { value: 'totalOutstanding', label: 'Outstanding Amount' },
    { value: 'totalDisbursed', label: 'Disbursed Amount' },
    { value: 'paymentPercentage', label: 'Payment Progress' },
    { value: 'lastTransactionDate', label: 'Last Transaction' },
    { value: 'approved_loan_amount', label: 'Approved Amount' }
  ];
  
  // Selected loan for detailed view
  selectedLoanReport: any = null;
  
  // Export
  isExporting = false;

  // Template utilities
  Math = Math;

  constructor(
    private loanService: LoanService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Loan Management' }, { label: 'Reports', active: true }];
    this.loadReports();
  }

  loadReports(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    
    const reportFilters = {
      ...this.filters,
      page: this.currentPage,
      limit: this.limit
    };

    this.loanService.getAllUsersLoanReport(reportFilters).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          console.log('Loan Report Response:', response);
          this.loanReports = response.data.loans;
          this.summary = response.data.summary;
          this.totalPages = response.data.pagination.pages;
          this.totalRecords = response.data.pagination.total;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loan reports:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadReports();
  }

  clearFilters() {
    this.filters = {
      search: '',
      status: '',
      loan_type: '',
      loan_id: '',
      name: '',
      email: '',
      user_id: '',
      min_outstanding: '',
      max_outstanding: '',
      start_date: '',
      end_date: '',
      sortBy: 'created_date',
      sortOrder: 'desc'
    };
    this.loadReports();
  }

  onPageChange(page: number) {
    this.loadReports(page);
  }

  viewLoanDetails(loanId: string, modal: any) {
    this.loadingDetail = true;
    this.selectedLoanReport = null;
    
    this.loanService.getLoanComprehensiveReport(loanId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.selectedLoanReport = response.data;
          this.modalService.open(modal, { size: 'xl', scrollable: true });
        }
        this.loadingDetail = false;
      },
      error: (error) => {
        console.error('Error loading loan details:', error);
        this.loadingDetail = false;
      }
    });
  }

  getRiskLevel(loan: LoanReport): string {
    if (loan.totalOutstanding <= 0) return 'Low';
    
    const outstandingRatio = loan.totalOutstanding / loan.totalDisbursed;
    const daysSinceLastPayment = loan.daysSinceLastPayment || 0;
    
    if (outstandingRatio > 0.8 || daysSinceLastPayment > 90) return 'High';
    if (outstandingRatio > 0.5 || daysSinceLastPayment > 30) return 'Medium';
    return 'Low';
  }

  getRiskLevelClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'High': return 'bg-danger';
      case 'Medium': return 'bg-warning';
      case 'Low': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-success';
      case 'Pending': return 'bg-warning';
      case 'Rejected': return 'bg-danger';
      case 'Completed': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  formatPercentage(value: number): string {
    return `${(value || 0).toFixed(1)}%`;
  }

  exportToCSV() {
    this.isExporting = true;
    
    // Prepare CSV data
    const csvData = this.loanReports.map(loan => ({
      'Loan ID': loan.loan_id,
      'User Name': loan.user.name,
      'User ID': loan.user.user_id,
      'Email': loan.user.email,
      'Phone': loan.user.phone,
      'Loan Type': loan.loan_type,
      'Status': loan.status,
      'Requested Amount': loan.requested_loan_amount,
      'Approved Amount': loan.approved_loan_amount,
      'Interest Rate': `${loan.interest_rate}%`,
      'Duration': `${loan.duration} ${loan.interval}`,
      'Purpose': loan.purpose,
      'Total Disbursed': loan.totalDisbursed,
      'Total Paid': loan.totalPaid,
      'Outstanding Amount': loan.totalOutstanding,
      'Payment Progress': `${loan.paymentPercentage?.toFixed(1)}%`,
      'Risk Level': this.getRiskLevel(loan),
      'Start Date': loan.start_date,
      'Created Date': loan.created_date,
      'Last Payment': loan.lastTransactionDate || 'N/A'
    }));
    
    this.downloadCSV(csvData, 'loan-reports');
    this.isExporting = false;
  }

  private downloadCSV(data: any[], filename: string) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(objArray: any[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    
    // Header
    const headers = Object.keys(array[0]);
    str += headers.join(',') + '\r\n';
    
    // Data
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ',';
        line += `"${array[i][index]}"`;
      }
      str += line + '\r\n';
    }
    
    return str;
  }

}
