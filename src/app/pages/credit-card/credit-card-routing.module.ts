import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestNewCardComponent } from './components/request-new-card/request-new-card.component';
import { AssignedCardListComponent } from './components/assigned-card-list/assigned-card-list.component';
import { UserAmountComponent } from './components/user-amount/user-amount.component';
import { PaybleAmountComponent } from './components/payble-amount/payble-amount.component';
import { AllTransanctionComponent } from './components/all-transanction/all-transanction.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'list', component: CardListComponent },
  { path: 'request', component: RequestNewCardComponent },
  { path: 'assigned-card-list', component: AssignedCardListComponent },
  { path: 'request-amount', component: UserAmountComponent },
  { path: 'payable-amount', component: PaybleAmountComponent },
  { path: 'all-transanction', component: AllTransanctionComponent },
  { path: 'reports', component: ReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCardRoutingModule { }
