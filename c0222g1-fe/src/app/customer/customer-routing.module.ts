import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {EidtCustomerComponent} from './component/eidt-customer/eidt-customer.component';


const routes: Routes = [
  {
    path: 'createCustomer', component: CreateCustomerComponent
  },
  {
    path: 'editCustomer', component: EidtCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
