import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ComputerCreateComponent} from './component/computer-create/computer-create.component';
import {ComputerEditComponent} from './component/computer-edit/computer-edit.component';
import {ComputerListComponent} from './component/computer-list/computer-list.component';
import {AuthGuardEmployeeAdminService} from '../authentication/service/auth-guard-employee-admin.service';
import {AuthGuardAdminService} from '../authentication/service/auth-guard-admin.service';


const routes: Routes = [
  {
    path: 'computers', component: ComputerListComponent,
    canActivate: [AuthGuardEmployeeAdminService]
  },
  {
    path: 'computers/create', component: ComputerCreateComponent,
  canActivate: [AuthGuardAdminService]
  },
  {
    path: 'computers/edit/:id', component: ComputerEditComponent,
    canActivate: [AuthGuardAdminService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputerRoutingModule {
}
