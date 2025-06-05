import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestsRoutingModule } from './contests-routing.module';
import { QuestionsComponent } from './components/questions/questions.component';
import { AnsQuestionsComponent } from './components/ans-questions/ans-questions.component';
import { UsersTransanctionComponent } from './components/users-transanction/users-transanction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [
    QuestionsComponent,
    AnsQuestionsComponent,
    UsersTransanctionComponent
  ],
  imports: [
    CommonModule,
    ContestsRoutingModule,
    FormsModule,
    UIModule,
    NgSelectModule,
    ReactiveFormsModule,
    Ng2SmartTableModule
  ]
})
export class ContestsModule { }
