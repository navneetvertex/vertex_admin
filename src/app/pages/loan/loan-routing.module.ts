import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanRequestedComponent } from './components/loan-requested/loan-requested.component';
import { LoanTransanctionComponent } from './components/loan-transanction/loan-transanction.component';
import { AdminLoanTransanctionComponent } from './components/admin-loan-transanction/admin-loan-transanction.component';
import { PayLoanComponent } from './components/pay-loan/pay-loan.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'loans/:type', component: LoanRequestedComponent },
  { path: 'pay-loan', component: PayLoanComponent },
  { path: 'user-transanction',component: LoanTransanctionComponent },
  { path: 'admin-transanction', component: AdminLoanTransanctionComponent },
  { path: 'reports', component: ReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
