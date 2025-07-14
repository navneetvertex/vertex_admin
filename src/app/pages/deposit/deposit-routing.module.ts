import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixedDepositComponent } from './components/fixed-deposit/fixed-deposit.component';
import { RecurringDepositComponent } from './components/recurring-deposit/recurring-deposit.component';
import { CompulsoryDepositsComponent } from './components/compulsory-deposits/compulsory-deposits.component';

const routes: Routes = [
  { path: 'fixed-deposit', component: FixedDepositComponent },
  { path: 'recurring-deposit', component: RecurringDepositComponent },
  { path: 'compulsory-deposit', component: CompulsoryDepositsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositRoutingModule { }
