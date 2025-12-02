import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoticeRoutingModule } from './notice-routing.module';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { UIModule } from 'src/app/shared/ui/ui.module';

@NgModule({
  declarations: [
    NoticeListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NoticeRoutingModule,
    UIModule
  ]
})
export class NoticeModule { }
