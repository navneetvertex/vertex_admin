import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './components/agents.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirefRefernceListComponent } from './components/diref-refernce-list/diref-refernce-list.component';
import { IndirefRefernceListComponent } from './components/indiref-refernce-list/indiref-refernce-list.component';
import { IncomeStaticsComponent } from './components/income-statics/income-statics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';


@NgModule({
  declarations: [
    AgentsComponent,
    DirefRefernceListComponent,
    IndirefRefernceListComponent,
    IncomeStaticsComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    AgentsRoutingModule,
    NgApexchartsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    SimplebarAngularModule
  ]
})
export class AgentsModule { }
