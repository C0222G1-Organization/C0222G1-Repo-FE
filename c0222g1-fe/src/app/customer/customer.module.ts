import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CreateCustomerHaoNHComponent } from './component/create-customer-hao-nh/create-customer-hao-nh.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CreateCustomerHaoNHComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
