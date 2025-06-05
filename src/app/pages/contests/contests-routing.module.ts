import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './components/questions/questions.component';
import { AnsQuestionsComponent } from './components/ans-questions/ans-questions.component';
import { UsersTransanctionComponent } from './components/users-transanction/users-transanction.component';

const routes: Routes = [
  { path: 'question', component: QuestionsComponent },
  { path: 'ans-question', component: AnsQuestionsComponent },
  { path: 'user-transanction', component: UsersTransanctionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContestsRoutingModule { }
