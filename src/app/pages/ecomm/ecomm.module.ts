import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcommRoutingModule } from './ecomm-routing.module';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CreateProductsComponent,
    OrdersComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    EcommRoutingModule,
    NgSelectModule,
    DropzoneModule,
    ReactiveFormsModule
  ]
})
export class EcommModule { }
