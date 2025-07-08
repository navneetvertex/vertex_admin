import { Component, OnInit } from '@angular/core';
import { PinsService } from 'src/app/core/services/pins.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-pins',
  templateUrl: './assigned-pins.component.html',
  styleUrls: ['./assigned-pins.component.scss']
})
export class AssignedPinsComponent implements OnInit {

  constructor(private pinService: PinsService) { }
  breadCrumbItems: Array<{}>;
  pinList: any[] = []
  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchTerm: string = ''

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Pin Management' }, { label: 'Assigned Pins', active: true }];
    this.getPins('assigned');
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.page = 1;
    this.getPins('assigned');
  }

  getPins(request: string) {
    this.pinService.getPins(request, this.page, this.pageSize, this.searchTerm).subscribe((res: any) => {
      if (res && res.data) {
        this.pinList = res?.data?.pins || [];
        this.total = res?.data?.total || 0;
      } else {
        this.pinList = [];
      }
    }, (err: any) => {
      console.error('Error fetching pin list:', err);
      this.pinList = [];
    });
  }

   findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getPins('assigned');
  }

  holdPin(pin: any) {
    Swal.fire({
      title: 'Hold Pin',
      text: `Are you sure you want to hold the pin ${pin.pin}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, hold it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pinService.inactivePin(pin._id, {status: 'Hold'}).subscribe((res: any) => {
          if (res && res.status === 'success') {
            Swal.fire('Success', 'Pin has been held successfully.', 'success');
            this.getPins('assigned');
          } else {
            Swal.fire('Error', 'Failed to hold the pin. Please try again.', 'error');
          }
        }, (err: any) => {
          console.error('Error holding pin:', err);
          Swal.fire('Error', 'Failed to hold the pin. Please try again.', 'error');
        });
      }
    });
  }

  unlockPin(pin: any) {
    Swal.fire({
      title: 'Unlock Pin',
      text: `Are you sure you want to unlock the pin ${pin.pin}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unlock it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pinService.inactivePin(pin._id, {status: 'Assigned'}).subscribe((res: any) => {
          if (res && res.status === 'success') {
            Swal.fire('Success', 'Pin has been unlocked successfully.', 'success');
            this.getPins('assigned');
          } else {
            Swal.fire('Error', 'Failed to unlock the pin. Please try again.', 'error');
          }
        }, (err: any) => {
          console.error('Error unlocking pin:', err);
          Swal.fire('Error', 'Failed to unlock the pin. Please try again.', 'error');
        });
      }
    });
  }
}
