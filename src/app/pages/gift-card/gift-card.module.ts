import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftCardRoutingModule } from './gift-card-routing.module';
import { AddGiftCardComponent } from './components/add-gift-card/add-gift-card.component';
import { GiftCardsComponent } from './components/gift-cards/gift-cards.component';
import { DistributorComponent } from './components/distributor/distributor.component';
import { ReceiveGiftCardsComponent } from './components/receive-gift-cards/receive-gift-cards.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperComponent } from './components/add-gift-card/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AddGiftCardComponent,
    GiftCardsComponent,
    DistributorComponent,
    ReceiveGiftCardsComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    NgbPaginationModule,
    ImageCropperModule,
    ReactiveFormsModule,
    GiftCardRoutingModule
  ]
})
export class GiftCardModule { }
