import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './component/product/product.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ProductModule { }
