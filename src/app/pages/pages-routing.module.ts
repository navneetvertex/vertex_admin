import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { DefaultComponent } from './dashboards/default/default.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'filemanager', component: FilemanagerComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  // { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
  { path: 'contests', loadChildren: () => import('./contests/contests.module').then(m => m.ContestsModule) },
  { path: 'ecommerce', loadChildren: () => import('./ecomm/ecomm.module').then(m => m.EcommModule) },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
