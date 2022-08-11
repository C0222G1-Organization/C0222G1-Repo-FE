import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {CustomerListComponent} from './component/customer-list/customer-list.component';


const routes: Routes = [
  {
    path: 'info',
    component: CustomerInformationComponent
  },
  {
    path: 'listCustomer',
    component: CustomerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
