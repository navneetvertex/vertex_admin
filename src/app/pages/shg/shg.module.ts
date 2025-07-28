import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShgRoutingModule } from './shg-routing.module';
import { ShgComponent } from './components/shg.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ShgComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgSelectModule,
    FormsModule,
    ShgRoutingModule
  ]
})
export class ShgModule { }
