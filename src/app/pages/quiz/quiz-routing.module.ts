import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuizComponent } from './components/add-quiz/add-quiz.component';
import { ListQuizComponent } from './components/list-quiz/list-quiz.component';
import { AllMatchQuizComponent } from './components/all-match-quiz/all-match-quiz.component';
import { DeclareResultQuizComponent } from './components/declare-result-quiz/declare-result-quiz.component';
import { UserAnsListComponent } from './components/user-ans-list/user-ans-list.component';

const routes: Routes = [
  { path: 'add', component: AddQuizComponent },
  { path: 'list', component: ListQuizComponent },
  { path: 'common-quiz', component: AllMatchQuizComponent },
  { path: 'undeclared-match', component: UserAnsListComponent },
  { path: 'results', component: DeclareResultQuizComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
