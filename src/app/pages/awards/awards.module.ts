import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwardsRoutingModule } from './awards-routing.module';
import { AwardsComponent } from './components/awards/awards.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AwardsComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule, 
    AwardsRoutingModule
  ]
})
export class AwardsModule { }
