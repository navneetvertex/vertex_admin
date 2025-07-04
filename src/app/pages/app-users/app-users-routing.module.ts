import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUsersComponent } from './components/app-users.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { CompulsoryDepositComponent } from './components/compulsory-deposit/compulsory-deposit.component';
import { RecurringDepositComponent } from './components/recurring-deposit/recurring-deposit.component';
import { FixedDepositComponent } from './components/fixed-deposit/fixed-deposit.component';
import { KycRequestComponent } from './components/kyc-request/kyc-request.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { NotificationsListsComponent } from './components/notifications-lists/notifications-lists.component';

const routes: Routes = [
  { path: 'all', component: AppUsersComponent },
  { path: 'kyc', component: KycRequestComponent },
  { path: 'profile/:user', component: ViewProfileComponent },
  { path: 'profile/form/:user', component: EditFormComponent },
  { path: 'view/:user', component: EditProfileComponent },
  { path: 'compulsory-deposit/:user', component: CompulsoryDepositComponent },
  { path: 'recurring-deposits/:user', component: RecurringDepositComponent },
  { path: 'fixed-deposits/:user', component: FixedDepositComponent },
  { path: 'notification-list', component: NotificationsListsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUsersRoutingModule { }
