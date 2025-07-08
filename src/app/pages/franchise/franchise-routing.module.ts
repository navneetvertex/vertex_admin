import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FranchiseListComponent } from './components/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './components/franchise-add/franchise-add.component';
import { ListMembersComponent } from './components/franchise-list/list-members/list-members.component';

const routes: Routes = [
  { path: 'list', component: FranchiseListComponent },
  { path: 'add', component: FranchiseAddComponent },
  { path: 'member-list/:id', component: ListMembersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FranchiseRoutingModule { }
