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
    this._fetchData();
  }

  getUserDetails(user_id: string) {
      this.usersService.getUserById(user_id).subscribe((res: any) => {
        if (res && res.data) {
          const user = res.data.user;
          this.userDetails = user;
          console.log('User Details:', user);
        }
      }, (err: any) => {
        this.router.navigate(['/members']);
        console.error('Error fetching user details:', err);
      });
    }

  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = this.statData;
  }

  openAadhar() {
    if(this.userDetails?.kyc?.aadhar_front){
      Swal.fire({
        imageUrl: this.userDetails?.kyc?.aadhar_front,
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
    if(this.userDetails?.kyc?.pan_image) {
      Swal.fire({
        imageUrl: this.userDetails?.kyc?.pan_image,
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

}
