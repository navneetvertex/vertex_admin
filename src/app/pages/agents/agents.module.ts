import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './components/agents.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DirefRefernceListComponent } from './components/diref-refernce-list/diref-refernce-list.component';
import { IndirefRefernceListComponent } from './components/indiref-refernce-list/indiref-refernce-list.component';


@NgModule({
  declarations: [
    AgentsComponent,
    DirefRefernceListComponent,
    IndirefRefernceListComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    AgentsRoutingModule
  ]
})
export class AgentsModule { }
