import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerInformationComponent} from "./component/customer-information/customer-information.component";


const routes: Routes = [
  {
    path: 'info',
    component: CustomerInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
