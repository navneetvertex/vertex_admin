import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-notifications-lists',
  templateUrl: './notifications-lists.component.html',
  styleUrls: ['./notifications-lists.component.scss']
})
export class NotificationsListsComponent implements OnInit {

  constructor(private notificationService: NotificationsService) { }

  total: number = 0;
  page: number = 1;
  pageSize: number = 10;
  notificationList: any[] = [];

  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.breadCrumbItems = [{ label: 'Notification' }, { label: 'List', active: true }];
    this.notificationService.getAllNotifications( this.pageSize, this.page).subscribe((res: any) => {
      if (res && res.data) {
        this.notificationList = res.data.notifications || [];
        console.log(this.notificationList);
        this.total = res.data.total || 0;
      } else {
        this.total = 0;
      }
    });
  }

  findPageShowing(): number {
    return Math.min(this.page * this.pageSize, this.total)
  }

  pageChange(page: number) {
    this.page = page;
    this.getAllNotifications();
  }

  

}
