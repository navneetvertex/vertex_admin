import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner/banner.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DropzoneModule } from 'ngx-dropzone-wrapper';


@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    BannerRoutingModule
  ]
})
export class BannerModule { }
