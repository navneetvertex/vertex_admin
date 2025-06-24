import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatesComponent } from './components/states/states.component';
import { DistrictComponent } from './components/district/district.component';
import { AreasComponent } from './components/areas/areas.component';

const routes: Routes = [
  { path: 'states', component: StatesComponent },
  { path: 'districts', component: DistrictComponent },
  { path: 'areas', component: AreasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
