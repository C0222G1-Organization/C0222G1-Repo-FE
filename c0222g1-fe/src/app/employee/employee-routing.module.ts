import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeListComponent} from './component/employee-list/employee-list.component';
import {EmployeeCreateComponent} from './component/employee-create/employee-create.component';
import {EmployeeUpdateComponent} from "./component/employee-update/employee-update.component";


const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent
  },
  {
    path: 'employees/add',
    component: EmployeeCreateComponent
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeUpdateComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
