import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/core/models/auth.models';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  listNotifications = [];
  countryName;
  valueset;
  unreadCount: number = 0;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(@Inject(DOCUMENT) private document: any, private router: Router,
              public languageService: LanguageService,
              public translate: TranslateService,
              private notificationService: NotificationsService ,
              public _cookiesService: CookieService) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.getNotification();
    
  }

  getNotification() {
    this.notificationService.getAdminQuickNotifications().subscribe((data: any) => {
      this.listNotifications = data.data.notifications || [];
      this.unreadCount = data.data.unreadCount || [];
    }, error => {
      console.error('Error fetching notifications:', error);
    });
  }

  hoursminutesSeconds(time: string): string {
    const now = new Date();
    const past = new Date(time);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 365) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  readAllNotifications() {
    this.notificationService.markAllAdminNotificationsAsRead().subscribe((data: any) => {
      console.log('All notifications marked as read');
      this.unreadCount = 0;
      this.getNotification();
    }, error => {
      console.error('Error marking all notifications as read:', error);
    });
  }

  clickSingleNotification(notification: any) {
    // Close the ngbDropdownMenu if open
    const dropdownMenu = document.querySelector('.dropdown-menu.show');
    if (dropdownMenu) {
      (dropdownMenu as HTMLElement).classList.remove('show');
    }
    if (!notification.is_read) {
      this.notificationService.markAdminNotificationAsRead(notification._id).subscribe((data: any) => {
        console.log('Notification marked as read:', data);
        notification.is_read = true;
        this.unreadCount--;
        if(notification.action === 'view') {
          this.router.navigate([notification.action_url]);
        }
      }, error => {
        console.error('Error marking notification as read:', error);
      });
    }
    // Navigate to the specific page based on the notification type
    if (notification.type === 'user') {
      this.router.navigate(['/app-users/user-profile', notification.user_id]);
    } else if (notification.type === 'transaction') {
      this.router.navigate(['/app-transactions/transaction-details', notification.transaction_id]);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    localStorage.clear()
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._cookiesService.deleteAll('/');
    this.router.navigate(['/account/login']);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
