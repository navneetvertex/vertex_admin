import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FranchiseRoutingModule } from './franchise-routing.module';
import { FranchiseListComponent } from './components/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './components/franchise-add/franchise-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ListMembersComponent } from './components/franchise-list/list-members/list-members.component';


@NgModule({
  declarations: [
    FranchiseListComponent,
    FranchiseAddComponent,
    ListMembersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UIModule,
    NgSelectModule,
    NgbPaginationModule,
    FranchiseRoutingModule
  ]
})
export class FranchiseModule { }
