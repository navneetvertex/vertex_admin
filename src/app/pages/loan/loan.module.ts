import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRoutingModule } from './loan-routing.module';
import { LoanRequestedComponent } from './components/loan-requested/loan-requested.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LoanTransanctionComponent } from './components/loan-transanction/loan-transanction.component';
import { AdminLoanTransanctionComponent } from './components/admin-loan-transanction/admin-loan-transanction.component';


@NgModule({
  declarations: [
    LoanRequestedComponent,
    LoanTransanctionComponent,
    AdminLoanTransanctionComponent
  ],
  imports: [
    CommonModule,
    UIModule, 
    NgbPaginationModule,
    ReactiveFormsModule,
    LoanRoutingModule
  ]
})
export class LoanModule { }
