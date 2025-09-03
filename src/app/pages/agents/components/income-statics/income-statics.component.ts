import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/user.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexMarkers,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  colors: string[];
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  plotOptions?: ApexPlotOptions;
};

@Component({
  selector: 'app-income-statics',
  templateUrl: './income-statics.component.html',
  styleUrls: ['./income-statics.component.scss']
})
export class IncomeStaticsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  // Chart options
  public mainChartOptions: Partial<ChartOptions> = {};
  public breakdownChartOptions: Partial<ChartOptions> = {};

  // Data properties
  incomeData: any = null;
  isLoading: boolean = false;
  error: string = '';

  // Filter properties
  advisorId: string = '';
  userId: string = '';
  type: string = 'direct';

  // Summary data
  summaryCards = [
    { title: 'Total Earnings', value: '₹0', icon: 'bx bx-money', color: 'primary', growth: '0%' },
    { title: 'Growth', value: '0%', icon: 'bx bx-trending-up', color: 'success', growth: '0%' },
    { title: 'Top Month', value: 'N/A', icon: 'bx bx-calendar', color: 'info', growth: '0%' },
    { title: 'Active Months', value: '0', icon: 'bx bx-time', color: 'warning', growth: '0%' }
  ];

  breadCrumbItems = [
    { label: 'Agents', url: '/agents' },
    { label: 'Income Statistics', url: '' }
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.initializeChartOptions();

    // Get parameters from route
    this.advisorId = this.route.snapshot.paramMap.get('advisor_id') || '';
    this.type = this.route.snapshot.paramMap.get('type') || 'direct';
    this.userId = this.route.snapshot.paramMap.get('user_id') || '';

    if (this.advisorId) {
      this.getUserIncomeStatistics(this.advisorId, this.userId, this.type);
    }
  }

  initializeChartOptions() {
    // Main chart for current vs previous year
    this.mainChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },
      colors: ["#556ee6", "#34c38f"],
      xaxis: {
        categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        title: {
          text: "Months (Financial Year)"
        }
      },
      yaxis: {
        title: {
          text: "Income (₹)"
        },
        labels: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          }
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center"
      },
      grid: {
        show: true,
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      },
      markers: {
        size: 4,
        colors: ["#556ee6", "#34c38f"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 6
        }
      }
    };

    // Breakdown chart for income sources
    this.breakdownChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "bar",
        stacked: true,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#556ee6", "#34c38f", "#f46a6a"],
      xaxis: {
        categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
      },
      yaxis: {
        title: {
          text: "Income (₹)"
        },
        labels: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          }
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center"
      }
    };
  }

  getUserIncomeStatistics(advisorId: string, userId: string, type: string) {
    this.isLoading = true;
    this.error = '';

    this.userService.getUserIncomeStatistics(advisorId, userId, type).subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.incomeData = response.data;
          this.updateCharts();
          this.updateSummaryCards();
        } else {
          this.error = 'Failed to load income statistics';
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching income statistics:', error);
        this.error = error.error?.message || 'Failed to load income statistics';
        this.isLoading = false;
      }
    );
  }

  updateCharts() {
    if (!this.incomeData || !this.incomeData.series) return;

    // Update main chart
    this.mainChartOptions.series = this.incomeData.series;

    // Update breakdown chart with income sources
    if (this.incomeData.breakdownSeries) {
      const memberSeries = this.incomeData.breakdownSeries.filter((s: any) =>
        s.type === 'member' && s.name.includes('Current')
      );
      const cardSeries = this.incomeData.breakdownSeries.filter((s: any) =>
        s.type === 'card' && s.name.includes('Current')
      );
      const loanSeries = this.incomeData.breakdownSeries.filter((s: any) =>
        s.type === 'loan' && s.name.includes('Current')
      );

      this.breakdownChartOptions.series = [
        ...(memberSeries.length > 0 ? memberSeries : []),
        ...(cardSeries.length > 0 ? cardSeries : []),
        ...(loanSeries.length > 0 ? loanSeries : [])
      ];
    }
  }

  updateSummaryCards() {
    if (!this.incomeData || !this.incomeData.summary) return;

    const summary = this.incomeData.summary;
    const totals = this.incomeData.totals;

    this.summaryCards = [
      {
        title: 'Total Earnings',
        value: `₹${summary.totalEarnings?.toLocaleString() || '0'}`,
        icon: 'bx bx-money',
        color: 'primary',
        growth: summary.growthPercentage ? `${summary.growthPercentage}%` : '0%'
      },
      {
        title: 'Year-over-Year Growth',
        value: summary.growthPercentage ? `${summary.growthPercentage}%` : '0%',
        icon: 'bx bx-trending-up',
        color: summary.growthPercentage >= 0 ? 'success' : 'danger',
        growth: summary.growthPercentage ? `${summary.growthPercentage}%` : '0%'
      },
      {
        title: 'Top Earning Month',
        value: summary.topEarningMonth?.current?.month || 'N/A',
        icon: 'bx bx-calendar',
        color: 'info',
        growth: summary.topEarningMonth?.current?.amount ?
          `₹${summary.topEarningMonth.current.amount.toLocaleString()}` : '₹0'
      },
      {
        title: 'Income Breakdown',
        value: summary.incomeBreakdown?.member || '0%',
        icon: 'bx bx-pie-chart-alt',
        color: 'warning',
        growth: `Member: ${summary.incomeBreakdown?.member || '0%'}`
      }
    ];
  }

  onTypeChange(type: string) {
    this.type = type;
    if (this.advisorId) {
      this.getUserIncomeStatistics(this.advisorId, this.userId, this.type);
    }
  }

  refreshData() {
    if (this.advisorId) {
      this.getUserIncomeStatistics(this.advisorId, this.userId, this.type);
    }
  }

  exportData() {
    if (!this.incomeData) return;

    const dataStr = JSON.stringify(this.incomeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `income-statistics-${this.advisorId}-${this.type}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  calculateMonthlyGrowth(monthIndex: number): number {
    if (!this.incomeData?.monthlyData?.current?.total || !this.incomeData?.monthlyData?.previous?.total) {
      return 0;
    }

    const currentValue = this.incomeData.monthlyData.current.total[monthIndex] || 0;
    const previousValue = this.incomeData.monthlyData.previous.total[monthIndex] || 0;

    if (previousValue === 0) {
      return currentValue > 0 ? 100 : 0;
    }

    return Math.round(((currentValue - previousValue) / previousValue) * 100);
  }
}
