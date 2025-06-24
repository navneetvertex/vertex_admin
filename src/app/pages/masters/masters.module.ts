import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { StatesComponent } from './components/states/states.component';
import { DistrictComponent } from './components/district/district.component';
import { AreasComponent } from './components/areas/areas.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    StatesComponent,
    DistrictComponent,
    AreasComponent,
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MastersRoutingModule
  ]
})
export class MastersModule { }
