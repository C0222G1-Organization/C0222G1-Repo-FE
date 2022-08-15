
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerRoutingModule} from './customer-routing.module';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditCustomerComponent} from './component/edit-customer/edit-customer.component';

  @NgModule({
    declarations: [CreateCustomerComponent, EditCustomerComponent,CustomerInformationComponent],

    imports: [
      CommonModule,
      CustomerRoutingModule,
      ReactiveFormsModule,
      FormsModule
    ]
  })
  export class CustomerModule {
  }
