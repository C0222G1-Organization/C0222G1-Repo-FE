import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './component/product/product.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CurrentPipePipe } from './current-pipe.pipe';

@NgModule({
  declarations: [ProductComponent, CurrentPipePipe],
  imports: [
    CommonModule,
    ProductRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProductModule { }
