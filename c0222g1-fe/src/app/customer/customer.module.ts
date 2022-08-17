import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomerListComponent} from './component/customer-list/customer-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CreateCustomerHaoNHComponent} from './component/create-customer-hao-nh/create-customer-hao-nh.component';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {EditCustomerComponent} from './component/edit-customer/edit-customer.component';


@NgModule({

  declarations: [HomePageCustomerComponent,
    CustomerInformationComponent,
    CreateCustomerHaoNHComponent,
    CreateCustomerComponent,
    EditCustomerComponent,
    CustomerListComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class CustomerModule {
}
