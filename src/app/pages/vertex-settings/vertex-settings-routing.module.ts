import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './components/general/general.component';
import { MemberFeesComponent } from './components/member-fees/member-fees.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: 'fees', component: MemberFeesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VertexSettingsRoutingModule { }
