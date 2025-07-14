import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositRoutingModule } from './deposit-routing.module';
import { FixedDepositComponent } from './components/fixed-deposit/fixed-deposit.component';
import { RecurringDepositComponent } from './components/recurring-deposit/recurring-deposit.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CompulsoryDepositsComponent } from './components/compulsory-deposits/compulsory-deposits.component';


@NgModule({
  declarations: [
    FixedDepositComponent,
    RecurringDepositComponent,
    CompulsoryDepositsComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule ,
    NgbPaginationModule,
    DepositRoutingModule
  ]
})
export class DepositModule { }
