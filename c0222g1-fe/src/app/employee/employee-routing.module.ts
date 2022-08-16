import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeListComponent} from './component/employee-list/employee-list.component';

import {ServerErrorComponent} from "../common-component/server-error/server-error.component";

import {EmployeeCreateComponent} from './component/employee-create/employee-create.component';



const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent

  }, {
  path: '500',
    component: ServerErrorComponent

  },
  {
    path: 'employees/add',
    component: EmployeeCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
