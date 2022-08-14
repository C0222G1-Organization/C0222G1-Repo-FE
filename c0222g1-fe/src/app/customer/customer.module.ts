import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';

import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';

@NgModule({
  declarations: [HomePageCustomerComponent,
    CustomerInformationComponent],

  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule {
}
