import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { AddQuizComponent } from './components/add-quiz/add-quiz.component';
import { ListQuizComponent } from './components/list-quiz/list-quiz.component';
import { DeclareResultQuizComponent } from './components/declare-result-quiz/declare-result-quiz.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../form/form.module';
import { AllMatchQuizComponent } from './components/all-match-quiz/all-match-quiz.component';
import { UserAnsListComponent } from './components/user-ans-list/user-ans-list.component';


@NgModule({
  declarations: [
    AddQuizComponent,
    ListQuizComponent,
    DeclareResultQuizComponent,
    AllMatchQuizComponent,
    UserAnsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UIModule,
    ReactiveFormsModule,
    NgSelectModule,
    QuizRoutingModule
  ]
})
export class QuizModule { }
