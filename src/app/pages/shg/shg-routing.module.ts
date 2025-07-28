import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShgComponent } from './components/shg.component';

const routes: Routes = [{ path: '', component: ShgComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShgRoutingModule { }
