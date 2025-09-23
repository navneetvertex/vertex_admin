import { Component, OnInit } from '@angular/core';
import { CreditCardService } from 'src/app/core/services/credit-card.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface CreditCardReport {
  cardId: string;
  cardNumber: string;
  cardStatus: string;
  approvedLimit: number;
  interestRate: number;
  startDate: string;
  userId: string;
  userIdDisplay: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userStatus: string;
  totalCredit: number;
  totalPayments: number;
  totalOutstanding: number;
  outstandingPrincipal: number;
  outstandingInterest: number;
  outstandingPenalty: number;
  creditUtilization: number;
  availableCredit: number;
  riskLevel: string;
  hasOutstandingAmount: boolean;
  hasOverdueAmount: boolean;
  hasPenaltyAmount: boolean;
  totalTransactions: number;
  lastTransactionDate: string;
  accountAge: number;
}

interface ReportSummary {
  totalCards: number;
  totalCreditLimit: number;
  totalOutstandingAmount: number;
  totalCreditUsed: number;
  totalPaymentsMade: number;
  avgCreditUtilization: number;
  overallUtilizationRate: number;
  highRiskCards: number;
  mediumRiskCards: number;
  lowRiskCards: number;
  cardsWithOutstanding: number;
  cardsWithOverdue: number;
  cardsWithPenalty: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  
  // Data
  creditCardReports: CreditCardReport[] = [];
  summary: ReportSummary = {} as ReportSummary;
  
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
    riskLevel: '',
    creditLimitMin: '',
    creditLimitMax: '',
    outstandingMin: '',
    outstandingMax: '',
    utilizationMin: '',
    utilizationMax: '',
    hasOutstanding: '',
    hasOverdue: '',
    hasPenalty: '',
    userStatus: '',
    sortBy: 'created_date',
    sortOrder: 'desc',
    includeZeroBalance: true
  };
  
  // Filter options
  statusOptions = ['Active', 'Inactive', 'Blocked', 'Pending'];
  riskLevelOptions = ['High', 'Medium', 'Low'];
  userStatusOptions = ['Active', 'Inactive', 'Blocked'];
  sortOptions = [
    { value: 'created_date', label: 'Card Creation Date' },
    { value: 'userName', label: 'User Name' },
    { value: 'totalOutstanding', label: 'Outstanding Amount' },
    { value: 'creditUtilization', label: 'Credit Utilization' },
    { value: 'approvedLimit', label: 'Credit Limit' },
    { value: 'lastTransactionDate', label: 'Last Transaction' }
  ];
  
  // Selected user for detailed view
  selectedUserReport: any = null;
  
  // Export
  isExporting = false;

  constructor(
    private creditCardService: CreditCardService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sahyog Card' }, { label: 'Reports', active: true }];
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

    this.creditCardService.getAllUsersCreditCardReport(reportFilters).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          console.log('Report Response:', response);
          this.creditCardReports = response.data;
          this.summary = response.summary;
          this.totalPages = response.pagination.totalPages;
          this.totalRecords = response.pagination.totalRecords;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
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
      riskLevel: '',
      creditLimitMin: '',
      creditLimitMax: '',
      outstandingMin: '',
      outstandingMax: '',
      utilizationMin: '',
      utilizationMax: '',
      hasOutstanding: '',
      hasOverdue: '',
      hasPenalty: '',
      userStatus: '',
      sortBy: 'created_date',
      sortOrder: 'desc',
      includeZeroBalance: true
    };
    this.loadReports();
  }

  onPageChange(page: number) {
    this.loadReports(page);
  }

  viewUserDetails(userId: string, cardId: string, modal: any) {
    this.loadingDetail = true;
    this.selectedUserReport = null;
    
    this.creditCardService.getUserComprehensiveReport(userId, cardId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.selectedUserReport = response.data;
          this.modalService.open(modal, { size: 'xl', scrollable: true });
        }
        this.loadingDetail = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.loadingDetail = false;
      }
    });
  }

  getRiskLevelClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'High': return 'badge bg-danger';
      case 'Medium': return 'badge bg-warning';
      case 'Low': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge bg-success';
      case 'Inactive': return 'badge bg-secondary';
      case 'Blocked': return 'badge bg-danger';
      case 'Pending': return 'badge bg-warning';
      default: return 'badge bg-secondary';
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

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  // Getter for pagination display
  get paginationEndIndex(): number {
    return Math.min(this.currentPage * this.limit, this.totalRecords);
  }

  get paginationStartIndex(): number {
    return ((this.currentPage - 1) * this.limit) + 1;
  }

  exportReport() {
    this.isExporting = true;
    
    // Export all data without pagination
    const exportFilters = {
      ...this.filters,
      limit: 10000,
      page: 1
    };

    this.creditCardService.getAllUsersCreditCardReport(exportFilters).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.downloadCSV(response.data);
        }
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting report:', error);
        this.isExporting = false;
      }
    });
  }

  private downloadCSV(data: CreditCardReport[]) {
    const csvHeaders = [
      'User ID', 'User Name', 'Email', 'Phone', 'User Status',
      'Card Number', 'Card Status', 'Credit Limit', 'Interest Rate',
      'Total Credit Used', 'Total Payments', 'Available Credit',
      'Credit Utilization %', 'Outstanding Principal', 'Outstanding Interest',
      'Outstanding Penalty', 'Total Outstanding', 'Risk Level',
      'Total Transactions', 'Account Age (Days)', 'Last Transaction Date'
    ];

    const csvData = data.map(card => [
      card.userIdDisplay,
      card.userName,
      card.userEmail,
      card.userPhone,
      card.userStatus,
      card.cardNumber,
      card.cardStatus,
      card.approvedLimit,
      card.interestRate,
      card.totalCredit,
      card.totalPayments,
      card.availableCredit,
      card.creditUtilization,
      card.outstandingPrincipal,
      card.outstandingInterest,
      card.outstandingPenalty,
      card.totalOutstanding,
      card.riskLevel,
      card.totalTransactions,
      card.accountAge,
      this.formatDate(card.lastTransactionDate)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `credit_card_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
