import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageCustomerComponent} from './component/home-page-customer/home-page-customer.component';
import {AuthGuardCustomerService} from '../authentication/service/auth-guard-customer.service';



const routes: Routes = [
  {path: 'home-page-customer',
   component: HomePageCustomerComponent,
    canActivate: [AuthGuardCustomerService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
