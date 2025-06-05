import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditCardRoutingModule } from './credit-card-routing.module';
import { RequestNewCardComponent } from './components/request-new-card/request-new-card.component';
import { AssignedCardListComponent } from './components/assigned-card-list/assigned-card-list.component';
import { UserAmountComponent } from './components/user-amount/user-amount.component';
import { PaybleAmountComponent } from './components/payble-amount/payble-amount.component';
import { AllTransanctionComponent } from './components/all-transanction/all-transanction.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RequestNewCardComponent,
    AssignedCardListComponent,
    UserAmountComponent,
    PaybleAmountComponent,
    AllTransanctionComponent
  ],
  imports: [
    CommonModule,
    CreditCardRoutingModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    UIModule
  ]
})
export class CreditCardModule { }
