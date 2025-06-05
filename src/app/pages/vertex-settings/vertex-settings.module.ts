import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VertexSettingsRoutingModule } from './vertex-settings-routing.module';
import { MemberFeesComponent } from './components/member-fees/member-fees.component';
import { GeneralComponent } from './components/general/general.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MemberFeesComponent,
    GeneralComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    VertexSettingsRoutingModule
  ]
})
export class VertexSettingsModule { }
