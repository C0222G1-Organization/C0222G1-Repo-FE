import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StatisticComponent} from './component/statistic/statistic.component';
import {AuthGuardEmployeeAdminService} from '../authentication/service/auth-guard-employee-admin.service';


const routes: Routes = [{
  path: 'statistic',
  component: StatisticComponent,
  canActivate: [AuthGuardEmployeeAdminService]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule { }
