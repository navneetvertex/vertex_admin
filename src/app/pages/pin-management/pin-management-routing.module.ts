import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPinsComponent } from './components/add-pins/add-pins.component';
import { AssignedPinsComponent } from './components/assigned-pins/assigned-pins.component';
import { FundPinComponent } from './components/fund-pin/fund-pin.component';

const routes: Routes = [
  { path: 'add', component: AddPinsComponent },
  { path: 'list', component: AssignedPinsComponent },
  { path: 'fund-pins', component: FundPinComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PinManagementRoutingModule { }
