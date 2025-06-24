import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule, NgbDatepickerModule, NgbTimepickerModule, NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { ToastsContainer } from './toast/toasts-container.component';
@NgModule({
  declarations: [PagetitleComponent,  LoaderComponent, ToastsContainer],
  imports: [
    CommonModule,
    FormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgbToastModule
  ],
  exports: [PagetitleComponent, LoaderComponent, ToastsContainer]
})
export class UIModule { }
