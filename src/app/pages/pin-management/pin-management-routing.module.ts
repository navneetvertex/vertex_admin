import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPinsComponent } from './components/add-pins/add-pins.component';
import { AssignedPinsComponent } from './components/assigned-pins/assigned-pins.component';

const routes: Routes = [
  { path: 'add', component: AddPinsComponent },
  { path: 'list', component: AssignedPinsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PinManagementRoutingModule { }
