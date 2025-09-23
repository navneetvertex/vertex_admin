import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoanRoutingModule } from './loan-routing.module';
import { LoanRequestedComponent } from './components/loan-requested/loan-requested.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LoanTransanctionComponent } from './components/loan-transanction/loan-transanction.component';
import { AdminLoanTransanctionComponent } from './components/admin-loan-transanction/admin-loan-transanction.component';
import { PayLoanComponent } from './components/pay-loan/pay-loan.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    LoanRequestedComponent,
    LoanTransanctionComponent,
    AdminLoanTransanctionComponent,
    PayLoanComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UIModule, 
    NgbPaginationModule,
    NgbModalModule,
    ReactiveFormsModule,
    NgSelectModule,
    LoanRoutingModule
  ]
})
export class LoanModule { }
