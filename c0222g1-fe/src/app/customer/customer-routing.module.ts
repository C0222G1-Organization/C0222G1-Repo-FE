import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateCustomerHaoNHComponent} from './component/create-customer-hao-nh/create-customer-hao-nh.component';


const routes: Routes = [
  {path: 'sign-up', component: CreateCustomerHaoNHComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
