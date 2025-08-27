import { Component, OnInit, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart, LoanCreditBarChart } from './data';
import { ChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';
import { ConfigService } from '../../../core/services/config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  isVisible: string;
  @ViewChild('chart') chart: any;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  LoanCreditBarChart : ChartType;
  transactions: Array<[]>;

  statData: any = [{
    icon: 'bx bx-copy-alt',
    title: 'Total Compulsory Deposits',
    value: '₹0'
  }, {
      icon: 'bx bx-archive-in',
      title: 'Total Recurring Deposits',
      value: '₹0'
  }, {
      icon: 'bx bx-purchase-tag-alt',
      title: 'Total Fixed Deposits',
      value: '₹0'
  }];

  statIncomeData: any = [{
    icon: 'bx bx-copy-alt',
    title: 'Approved Loan Amount',
    value: '₹0'
  }, {
      icon: 'bx bx-archive-in',
      title: 'Approved Credit Card Limit',
      value: '₹0'
  },];

  isActive: string;
  isActiveLoanCredit: string;
  data: any = null;
  totalCommission: any = null;
  advisorCommission: any = null;

  @ViewChild('content') content;
  constructor(private modalService: NgbModal, 
    private userService: UserProfileService ,
    private configService: ConfigService, private eventService: EventService, private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.getDashboardData();
     const attribute = document.body.getAttribute('data-layout');
    this.getCommissionReport()
     this.isVisible = attribute;
     const vertical = document.getElementById('layout-vertical');
     if (vertical != null) {
       vertical.setAttribute('checked', 'true');
     }
     if (attribute == 'horizontal') {
       const horizontal = document.getElementById('layout-horizontal');
       if (horizontal != null) {
         horizontal.setAttribute('checked', 'true');
       }
     }

    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.LoanCreditBarChart = LoanCreditBarChart;
    /**
     * Fetches the data
     */
    // this.fetchData();
  }

  getCommissionReport() {
    this.userService.getCommissionReport().subscribe((report: any) => {
      console.log(report);
      this.totalCommission = report.data.summary;
      this.advisorCommission = report.data.advisorCommissionSummary;
    });
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      this.data = data.data;
      this.statData[0].value = (this.data ? this.data.totalCDeposits : '0');
      this.statData[1].value = (this.data ? this.data.totalRDeposits : '0');
      this.statData[2].value = (this.data ? this.data.totalFDeposits : '0');
      this.statIncomeData[0].value = (this.data ? this.data.totalLoans : '0');
      this.statIncomeData[1].value = (this.data ? this.data.totalCreditCards : '0');
      this.emailSentBarChart.series = this.data.weeklySummary;
      this.isActive = 'week';
      this.isActiveLoanCredit = 'week';
      this.weeklyreport();
      this.weeklyLoanCreditreport();
    });
  }

  // private fetchData() {
  //   this.emailSentBarChart = emailSentBarChart;
  //   this.monthlyEarningChart = monthlyEarningChart;

    
  //   this.configService.getConfig().subscribe(data => {
  //     this.transactions = data.transactions;
  //     this.statData = this.statData;
  //   });
  // }


  weeklyreport() {
    this.isActive = 'week';
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks: string[] = [];
    let weekNumber = 1;
    let weekStart = new Date(firstDay);

    while (weekStart <= lastDay) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > lastDay) weekEnd = new Date(lastDay);

      weeks.push(`Week ${weekNumber} (${weekStart.getDate()}-${weekEnd.getDate()})`);
      weekNumber++;
      weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() + 1);
    }

    this.emailSentBarChart.xaxis.categories = weeks;
    this.emailSentBarChart.series = this.data.weeklySummary;
    this.emailSentBarChart = {
      ...this.emailSentBarChart,
      xaxis: {
        ...this.emailSentBarChart.xaxis,
        categories: weeks
      }
    };

  }

   monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series = this.data.monthlySummary;
    let months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.emailSentBarChart = {
      ...this.emailSentBarChart,
      xaxis: {
        ...this.emailSentBarChart.xaxis,
        categories: months
      }
    };
  }

  weeklyLoanCreditreport() {
    this.isActive = 'week';
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks: string[] = [];
    let weekNumber = 1;
    let weekStart = new Date(firstDay);

    while (weekStart <= lastDay) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > lastDay) weekEnd = new Date(lastDay);

      weeks.push(`Week ${weekNumber} (${weekStart.getDate()}-${weekEnd.getDate()})`);
      weekNumber++;
      weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() + 1);
    }

    this.LoanCreditBarChart.xaxis.categories = weeks;
    this.LoanCreditBarChart.series = this.data.weeklyLCSummary;
    this.LoanCreditBarChart = {
      ...this.LoanCreditBarChart,
      xaxis: {
        ...this.LoanCreditBarChart.xaxis,
        categories: weeks
      }
    };

  }

  monthlyLoanCreditreport() {
    this.isActiveLoanCredit = 'month';
    this.LoanCreditBarChart.series = this.data.monthlyLCSummary;
    let months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.LoanCreditBarChart = {
      ...this.LoanCreditBarChart,
      xaxis: {
        ...this.LoanCreditBarChart.xaxis,
        categories: months
      }
    };
  }

 

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Compulsory Deposits',
         data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Recurring Deposits',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Fixed Deposits',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }

   changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
