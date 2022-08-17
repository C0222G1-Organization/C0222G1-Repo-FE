import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeListComponent} from './component/employee-list/employee-list.component';
import {EmployeeCreateComponent} from './component/employee-create/employee-create.component';
import {EmployeeUpdateComponent} from "./component/employee-update/employee-update.component";

import {ServerErrorComponent} from "../common-component/server-error/server-error.component";

import {EmployeeCreateComponent} from './component/employee-create/employee-create.component';



const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent


    /**
     * Phải là admin mới có quyền truy cập
     */

  }, {
  path: '500',
    component: ServerErrorComponent


  },
  {
    path: 'employees/add',
    component: EmployeeCreateComponent

  },
  {
    path: 'employees/edit/:id',
    component: EmployeeUpdateComponent

    /**
     * Phải là admin mới có quyền truy cập
     */
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
