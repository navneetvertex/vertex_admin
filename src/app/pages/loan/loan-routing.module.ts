import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanRequestedComponent } from './components/loan-requested/loan-requested.component';
import { LoanTransanctionComponent } from './components/loan-transanction/loan-transanction.component';
import { AdminLoanTransanctionComponent } from './components/admin-loan-transanction/admin-loan-transanction.component';

const routes: Routes = [
  { path: '', component: LoanRequestedComponent },
  { path: 'user-transanction',component: LoanTransanctionComponent },
  { path: 'admin-transanction', component: AdminLoanTransanctionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
