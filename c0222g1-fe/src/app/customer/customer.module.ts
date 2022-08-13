import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerInformationComponent } from './component/customer-information/customer-information.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [CustomerInformationComponent, CustomerListComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ]
})
export class CustomerModule { }
