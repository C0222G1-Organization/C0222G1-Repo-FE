import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerInformationComponent } from './component/customer-information/customer-information.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { CreateCustomerHaoNHComponent } from './component/create-customer-hao-nh/create-customer-hao-nh.component';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';

@NgModule({
  declarations: [CustomerInformationComponent, CustomerListComponent,CreateCustomerHaoNHComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule
    ]
})
export class CustomerModule {
}
