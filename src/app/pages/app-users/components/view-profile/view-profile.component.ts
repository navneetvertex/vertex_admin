import { Component, OnInit } from '@angular/core';
import { ChartType } from './profile.model';
import { revenueBarChart } from './data';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  userDetails: any = null;
  loans: any[] = [];
  creditCards: any[] = [];
  kyc: any = null;
  totalCDeposit: number = 0;
  totalRDeposit: number = 0;
  totalFDeposit: number = 0;
  totalLoans: number = 0;
  isActive: string = 'week';
  totalCreditCards: number = 0;
  monthlySummary: any[] = [];
  weeklySummary: any[] = [];
  statData = [
    {
        icon: 'bx bx-check-circle',
        title: 'Complusory Deposit',
        value: '₹ 0'
    }, {
        icon: 'bx bx-hourglass',
        title: 'Recurring Deposit',
        value: '₹ 0'
    }, {
        icon: 'bx bx-package',
        title: 'Fixed Deposit',
        value: '₹ 0'
    }, {
        icon: 'bx bx-package',
        title: 'Total Loans',
        value: '₹ 0'
    }, {
        icon: 'bx bx-package',
        title: 'Total Credit Cards',
        value: '₹ 0'
    }
];

  revenueBarChart: ChartType;
  constructor(private usersService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    const user_id = this.route.snapshot.paramMap.get('user') || '';
    this.getUserDetails(user_id);
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Members' }, { label: 'Profile', active: true }];
    this.revenueBarChart = revenueBarChart;
  }

  getUserDetails(user_id: string) {
      this.usersService.getUserDashboard(user_id).subscribe((res: any) => {
        if (res && res.data) {
          this.userDetails  = res.data.user;
          this.loans = res.data.loan || [];
          this.creditCards = res.data.creditCard || [];
          this.kyc = res.data.kyc || null;
          this.totalCDeposit = res.data.totalCDeposit || 0;
          this.totalRDeposit = res.data.totalRDeposit || 0;
          this.totalFDeposit = res.data.totalFDeposit || 0;
          this.totalLoans = res.data.totalLoans || 0;
          this.totalCreditCards = res.data.totalCreditCards || 0;
          this.monthlySummary = res.data.monthlySummary || [];
          this.weeklySummary = res.data.weeklySummary || [];
          this.statData[0].value = `₹ ${this.totalCDeposit}`;
          this.statData[1].value = `₹ ${this.totalRDeposit}`;
          this.statData[2].value = `₹ ${this.totalFDeposit}`;
          this.statData[3].value = `₹ ${this.totalLoans}`;
          this.statData[4].value = `₹ ${this.totalCreditCards}`;
          this.weeklyreport()
        }
      }, (err: any) => {
        this.router.navigate(['/members']);
        console.error('Error fetching user details:', err);
      });
    }

  

  openAadhar() {
    if(this.kyc?.aadhar_front){
      Swal.fire({
        imageUrl: this.kyc?.aadhar_front,
        imageWidth: 600,
        imageHeight: 600,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-no-padding'
        },
        padding: 0,
        backdrop: true
      });
    }
  }

  openPan() {
    if(this.kyc?.pan_image) {
      Swal.fire({
        imageUrl: this.kyc?.pan_image,
        imageWidth: 600,
        imageHeight: 600,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-no-padding'
        },
        padding: 0,
        backdrop: true
      });
    }
  }

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

    this.revenueBarChart.xaxis.categories = weeks;
    this.revenueBarChart.series = this.weeklySummary;
    this.revenueBarChart = {
      ...this.revenueBarChart,
      xaxis: {
        ...this.revenueBarChart.xaxis,
        categories: weeks
      }
    };

    console.log(this.revenueBarChart);

  }

   monthlyreport() {
    this.isActive = 'month';
    this.revenueBarChart.series = this.monthlySummary;
    let months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.revenueBarChart = {
      ...this.revenueBarChart,
      xaxis: {
        ...this.revenueBarChart.xaxis,
        categories: months
      }
    };
  }

}
