import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUsersRoutingModule } from './app-users-routing.module';
import { AppUsersComponent } from './components/app-users.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { CompulsoryDepositComponent } from './components/compulsory-deposit/compulsory-deposit.component';
import { RecurringDepositComponent } from './components/recurring-deposit/recurring-deposit.component';
import { FixedDepositComponent } from './components/fixed-deposit/fixed-deposit.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { ImageCropperComponent } from './components/edit-profile/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [
    AppUsersComponent,
    ViewProfileComponent,
    EditProfileComponent,
    AddMemberComponent,
    CompulsoryDepositComponent,
    RecurringDepositComponent,
    FixedDepositComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    NgbDropdownModule,
    AppUsersRoutingModule,
    NgApexchartsModule,
    ArchwizardModule,
    WidgetModule,
    NgSelectModule,
    FormsModule, 
    ReactiveFormsModule ,
    NgbTooltipModule,
    NgbNavModule,
    ImageCropperModule,
    NgbPaginationModule,
    NgbDatepickerModule,
  ],
  exports: [ImageCropperComponent]
})
export class AppUsersModule { }
