import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {EditCustomerComponent} from './component/edit-customer/edit-customer.component';



const routes: Routes = [
  {

    path: 'createCustomer', component: CreateCustomerComponent
  },
{
  path: 'editCustomer', component: EditCustomerComponent
}, {
    path: 'info',
    component: CustomerInformationComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
