import { Component, OnInit } from '@angular/core';
import { PinsService } from 'src/app/core/services/pins.service';

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
}
