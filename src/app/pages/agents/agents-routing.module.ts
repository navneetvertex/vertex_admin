import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './components/agents.component';
import { DirefRefernceListComponent } from './components/diref-refernce-list/diref-refernce-list.component';
import { IndirefRefernceListComponent } from './components/indiref-refernce-list/indiref-refernce-list.component';
import { IncomeStaticsComponent } from './components/income-statics/income-statics.component';

const routes: Routes = [
  { path: '', component: AgentsComponent },
  { path: 'direct-ref/:id', component: DirefRefernceListComponent },
  { path: 'indirect-ref/:id', component: IndirefRefernceListComponent },
  { path: ':advisor_id/income-statics/:type/:user_id', component: IncomeStaticsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
