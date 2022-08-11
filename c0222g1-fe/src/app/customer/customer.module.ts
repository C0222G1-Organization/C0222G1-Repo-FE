import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerInformationComponent } from './component/customer-information/customer-information.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CustomerInformationComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
