import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubadminListComponent } from './components/subadmin-list/subadmin-list.component';
import { SubadminPermissionsComponent } from './components/subadmin-permissions/subadmin-permissions.component';
import { SubadminAddComponent } from './components/subadmin-add/subadmin-add.component';

const routes: Routes = [
  {
    path: 'list',
    component: SubadminListComponent
  },
  {
    path: 'add',
    component: SubadminAddComponent
  },
  {
    path: 'edit/:id',
    component: SubadminAddComponent
  },
  {
    path: 'permissions/:id',
    component: SubadminPermissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubadminRoutingModule { }
