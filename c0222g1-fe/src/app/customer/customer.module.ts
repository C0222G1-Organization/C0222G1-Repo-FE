import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CreateCustomerHaoNHComponent } from './component/create-customer-hao-nh/create-customer-hao-nh.component';


@NgModule({
  declarations: [CreateCustomerHaoNHComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
