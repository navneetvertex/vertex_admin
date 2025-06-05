import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareersRoutingModule } from './careers-routing.module';
import { CareersComponent } from './components/careers/careers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';


@NgModule({
  declarations: [
    CareersComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule ,
    CareersRoutingModule
  ]
})
export class CareersModule { }
