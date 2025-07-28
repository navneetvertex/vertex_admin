import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'members', loadChildren: () => import('./app-users/app-users.module').then(m => m.AppUsersModule) },
  { path: 'pin-management', loadChildren: () => import('./pin-management/pin-management.module').then(m => m.PinManagementModule) },
  { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
  { path: 'credit-management', loadChildren: () => import('./credit-card/credit-card.module').then(m => m.CreditCardModule) },
  { path: 'gift-card-management', loadChildren: () => import('./gift-card/gift-card.module').then(m => m.GiftCardModule) },
  { path: 'vertex-settings', loadChildren: () => import('./vertex-settings/vertex-settings.module').then(m => m.VertexSettingsModule) },
  { path: 'loan-management', loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule) },
  { path: 'careers', loadChildren: () => import('./careers/careers.module').then(m => m.CareersModule) },
  { path: 'awards', loadChildren: () => import('./awards/awards.module').then(m => m.AwardsModule) },
  { path: 'master-data', loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule) },
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule) },
  { path: 'agents', loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule) },
  { path: 'franchises', loadChildren: () => import('./franchise/franchise.module').then(m => m.FranchiseModule) },
  { path: 'deposits', loadChildren: () => import('./deposit/deposit.module').then(m => m.DepositModule) },
  { path: 'shg', loadChildren: () => import('./shg/shg.module').then(m => m.ShgModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
