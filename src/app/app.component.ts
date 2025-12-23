import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { fromEvent, merge, timer, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SettingsService } from './core/services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private inactivityTimer: Subscription;
  private warningTimer: Subscription;
  private activitySubscription: Subscription;
  private userSubscription: Subscription;
  private contextMenuSubscription: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private settingService: SettingsService
  ) {}

  ngOnInit() {
    this.settingService.loadGeneralSettings().subscribe(() => {
      console.log('General settings loaded successfully');
    });

    if(environment.production ) {
      // Disable right-click context menu
      this.contextMenuSubscription = fromEvent(document, 'contextmenu').subscribe((event: Event) => {
        event.preventDefault();
      });
  
      // Subscribe to user changes
      this.userSubscription = this.authService.currentUser.subscribe(user => {
        if (user) {
          this.startInactivityTimer();
        } else {
          this.stopInactivityTimer();
        }
      });
    }
  }

  ngOnDestroy() {
    this.stopInactivityTimer();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.contextMenuSubscription) {
      this.contextMenuSubscription.unsubscribe();
    }
  }

  private startInactivityTimer() {
    this.stopInactivityTimer();

    // Listen to user activity events
    const activityEvents = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart')
    ).pipe(debounceTime(1000)); // Debounce to avoid too many events

    this.activitySubscription = activityEvents.subscribe(() => {
      this.resetInactivityTimer();
    });

    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      this.inactivityTimer.unsubscribe();
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
    }

    // 14 minutes = 840000 ms (15 minutes total with 1 minute warning)
    this.inactivityTimer = timer(840000).subscribe(() => {
      this.showLogoutWarning();
    });
  }

  private showLogoutWarning() {
    Swal.fire({
      title: 'Session Timeout Warning',
      text: 'You will be logged out in 1 minute due to inactivity. Your session will expire after 15 minutes of inactivity.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Stay Logged In',
      cancelButtonText: 'Logout Now',
      timer: 60000, // 1 minute
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to stay logged in
        this.resetInactivityTimer();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // Timer expired, logout
        this.performLogout();
      } else {
        // User chose to logout now
        this.performLogout();
      }
    });

    // Also set a timer to logout after 1 minute if popup is still open
    this.warningTimer = timer(60000).subscribe(() => {
      Swal.close();
      this.performLogout();
    });
  }

  private performLogout() {
    this.authService.logout();
  }

  private stopInactivityTimer() {
    if (this.inactivityTimer) {
      this.inactivityTimer.unsubscribe();
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
    }
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
