import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { SubadminRoutingModule } from './subadmin-routing.module';
import { SubadminListComponent } from './components/subadmin-list/subadmin-list.component';
import { SubadminPermissionsComponent } from './components/subadmin-permissions/subadmin-permissions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { SubadminAddComponent } from './components/subadmin-add/subadmin-add.component';

@NgModule({
  declarations: [
    SubadminListComponent,
    SubadminAddComponent,
    SubadminPermissionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    UIModule,
    SubadminRoutingModule,
    SharedModule
  ]
})
export class SubadminModule { }
