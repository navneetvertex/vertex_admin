import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGiftCardComponent } from './components/add-gift-card/add-gift-card.component';
import { DistributorComponent } from './components/distributor/distributor.component';
import { ReceiveGiftCardsComponent } from './components/receive-gift-cards/receive-gift-cards.component';
import { GiftCardsComponent } from './components/gift-cards/gift-cards.component';

const routes: Routes = [
  { path: 'add', component: AddGiftCardComponent },
  { path: 'edit', component: AddGiftCardComponent },
  { path: 'list', component: GiftCardsComponent },
  { path: 'distributor', component: DistributorComponent },
  { path: 'receive', component: ReceiveGiftCardsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftCardRoutingModule { }
