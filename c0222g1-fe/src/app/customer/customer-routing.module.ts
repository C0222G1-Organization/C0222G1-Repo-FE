import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CustomerInformationComponent} from './component/customer-information/customer-information.component';
import {CreateCustomerHaoNHComponent} from './component/create-customer-hao-nh/create-customer-hao-nh.component';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';
import {AuthGuardCustomerService} from '../authentication/service/auth-guard-customer.service';
import {CreateCustomerComponent} from './component/create-customer/create-customer.component';
import {EditCustomerComponent} from './component/edit-customer/edit-customer.component';

const routes: Routes = [
  {
    path: 'customers/create', component: CreateCustomerComponent
  },
  {
    path: 'customers/edit/:id', component: EditCustomerComponent
  },
  {
    path: 'home-page-customer',
    component: HomePageCustomerComponent,
    canActivate: [AuthGuardCustomerService]
  },
  {
    path: 'home-page-customer/info',
    component: CustomerInformationComponent
  },
  {path: 'sign-up', component: CreateCustomerHaoNHComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
