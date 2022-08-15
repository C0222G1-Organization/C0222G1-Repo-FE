import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';

import { CreateCustomerHaoNHComponent } from './component/create-customer-hao-nh/create-customer-hao-nh.component';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {EditCustomerComponent} from './component/edit-customer/edit-customer.component';

@NgModule({

  declarations: [HomePageCustomerComponent,
    CustomerInformationComponent,
    CreateCustomerHaoNHComponent,
  CreateCustomerComponent,
  EditCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule {
}
