import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmployeeListComponent} from './component/employee-list/employee-list.component';
import {ServerErrorComponent} from "../common-component/server-error/server-error.component";


const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent
  }, {
  path: '500',
    component: ServerErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
