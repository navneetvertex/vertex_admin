import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PinManagementRoutingModule } from './pin-management-routing.module';
import { AddPinsComponent } from './components/add-pins/add-pins.component';
import { AssignedPinsComponent } from './components/assigned-pins/assigned-pins.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AddPinsComponent,
    AssignedPinsComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    PinManagementRoutingModule
  ]
})
export class PinManagementModule { }
