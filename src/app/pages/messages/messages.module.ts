import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './components/messages.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ReactiveFormsModule,
    MessagesRoutingModule
  ]
})
export class MessagesModule { }
