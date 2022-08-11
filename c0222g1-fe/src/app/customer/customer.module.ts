import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CreateCustomerComponent } from './component/create-customer/create-customer.component';
import { EidtCustomerComponent } from './component/eidt-customer/eidt-customer.component';


@NgModule({
  declarations: [CreateCustomerComponent, EidtCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
