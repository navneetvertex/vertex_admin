import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSyncRoutingModule } from './admin-sync-routing.module';
import { SeriesComponent } from './components/series/series.component';
import { MatchesComponent } from './components/matches/matches.component';
import { SeriesNewsComponent } from './components/series-news/series-news.component';
import { MatchNewsComponent } from './components/match-news/match-news.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { UpdatedComponent } from './components/updated/updated.component';


@NgModule({
  declarations: [
    SeriesComponent,
    MatchesComponent,
    SeriesNewsComponent,
    MatchNewsComponent,
    UpdatedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UIModule,
    ReactiveFormsModule,
    NgSelectModule,
    AdminSyncRoutingModule
  ]
})
export class AdminSyncModule { }
