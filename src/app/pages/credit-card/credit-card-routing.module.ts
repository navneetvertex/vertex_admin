import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestNewCardComponent } from './components/request-new-card/request-new-card.component';
import { AssignedCardListComponent } from './components/assigned-card-list/assigned-card-list.component';
import { UserAmountComponent } from './components/user-amount/user-amount.component';
import { PaybleAmountComponent } from './components/payble-amount/payble-amount.component';
import { AllTransanctionComponent } from './components/all-transanction/all-transanction.component';

const routes: Routes = [
  { path: 'request', component: RequestNewCardComponent },
  { path: 'assigned-card-list', component: AssignedCardListComponent },
  { path: 'request-amount', component: UserAmountComponent },
  { path: 'payable-amount', component: PaybleAmountComponent },
  { path: 'all-transanction', component: AllTransanctionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCardRoutingModule { }
