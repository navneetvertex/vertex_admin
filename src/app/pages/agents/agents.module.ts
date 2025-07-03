import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './components/agents.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AgentsComponent
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
