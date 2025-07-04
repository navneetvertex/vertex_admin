import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

constructor(private http: HttpClient) { }

// router.put('/admin/:notificationId', notificationController.markAdminNotificationAsRead);
// router.get('/allAdminread', notificationController.markAllAdminNotificationsAsRead);
// router.get('/quickAdmin', notificationController.getLast10AdminNotifications);


getAllNotifications(limit: number = 10, page: number = 0) {
  return this.http.get(`${environment.api_url}notifications/admin?limit=${limit}&page=${page}`);
}

getAdminQuickNotifications() {
  return this.http.get(`${environment.api_url}notifications/quickAdmin`);
}

markAdminNotificationAsRead(notificationId: string) {
  return this.http.get(`${environment.api_url}notifications/admin/${notificationId}`);
}

markAllAdminNotificationsAsRead() {
  return this.http.get(`${environment.api_url}notifications/allAdminread`);
}


}
