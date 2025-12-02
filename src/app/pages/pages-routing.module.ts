import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { PermissionGuard } from '../core/guards/permission.guard';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment/payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment/payment-failed/payment-failed.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent,
    canActivate: [PermissionGuard]
  },
  { path: 'dashboard', component: DefaultComponent, canActivate: [PermissionGuard] },
  { path: 'members', loadChildren: () => import('./app-users/app-users.module').then(m => m.AppUsersModule), canActivate: [PermissionGuard] },
  { path: 'pin-management', loadChildren: () => import('./pin-management/pin-management.module').then(m => m.PinManagementModule), canActivate: [PermissionGuard] },
  { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule), canActivate: [PermissionGuard] },
  { path: 'credit-management', loadChildren: () => import('./credit-card/credit-card.module').then(m => m.CreditCardModule), canActivate: [PermissionGuard] },
  { path: 'gift-card-management', loadChildren: () => import('./gift-card/gift-card.module').then(m => m.GiftCardModule), canActivate: [PermissionGuard] },
  { path: 'vertex-settings', loadChildren: () => import('./vertex-settings/vertex-settings.module').then(m => m.VertexSettingsModule), canActivate: [PermissionGuard] },
  { path: 'loan-management', loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule), canActivate: [PermissionGuard] },
  { path: 'careers', loadChildren: () => import('./careers/careers.module').then(m => m.CareersModule), canActivate: [PermissionGuard] },
  { path: 'awards', loadChildren: () => import('./awards/awards.module').then(m => m.AwardsModule), canActivate: [PermissionGuard] },
  { path: 'master-data', loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule), canActivate: [PermissionGuard] },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule), canActivate: [PermissionGuard] },
  { path: 'agents', loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule), canActivate: [PermissionGuard] },
  { path: 'subadmin', loadChildren: () => import('./subadmin/subadmin.module').then(m => m.SubadminModule), canActivate: [PermissionGuard] },
  { path: 'franchises', loadChildren: () => import('./franchise/franchise.module').then(m => m.FranchiseModule), canActivate: [PermissionGuard] },
  { path: 'deposits', loadChildren: () => import('./deposit/deposit.module').then(m => m.DepositModule), canActivate: [PermissionGuard] },
  { path: 'shg', loadChildren: () => import('./shg/shg.module').then(m => m.ShgModule), canActivate: [PermissionGuard] },
  { path: 'notices', loadChildren: () => import('./notice/notice.module').then(m => m.NoticeModule), canActivate: [PermissionGuard] },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment/failed', component: PaymentFailedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
