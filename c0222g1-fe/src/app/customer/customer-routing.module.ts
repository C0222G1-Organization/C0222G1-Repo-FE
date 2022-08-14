import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerInformationComponent} from './component/customer-information/customer-information.component';

import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';
import {AuthGuardCustomerService} from '../authentication/service/auth-guard-customer.service';

const routes: Routes = [
  {path: 'home-page-customer',
   component: HomePageCustomerComponent,
    canActivate: [AuthGuardCustomerService]},
  {
    path: 'home-page-customer/info',
    component: CustomerInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
