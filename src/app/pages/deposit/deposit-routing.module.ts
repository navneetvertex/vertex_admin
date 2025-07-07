import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixedDepositComponent } from './components/fixed-deposit/fixed-deposit.component';
import { RecurringDepositComponent } from './components/recurring-deposit/recurring-deposit.component';

const routes: Routes = [
  { path: 'fixed-deposit', component: FixedDepositComponent },
  { path: 'recurring-deposit', component: RecurringDepositComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositRoutingModule { }
