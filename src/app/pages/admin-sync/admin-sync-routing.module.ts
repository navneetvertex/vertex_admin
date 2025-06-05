import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeriesComponent } from './components/series/series.component';
import { MatchesComponent } from './components/matches/matches.component';
import { SeriesNewsComponent } from './components/series-news/series-news.component';
import { MatchNewsComponent } from './components/match-news/match-news.component';
import { UpdatedComponent } from './components/updated/updated.component';

const routes: Routes = [
  { path: 'series', component: SeriesComponent },
  { path: 'match', component: MatchesComponent },
  { path: 'series-news', component: SeriesNewsComponent },
  { path: 'match-news', component: MatchNewsComponent },
  { path: 'updates', component: UpdatedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSyncRoutingModule { }
