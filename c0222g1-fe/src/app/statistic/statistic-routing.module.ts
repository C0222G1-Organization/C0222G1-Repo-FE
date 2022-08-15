import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StatisticComponent} from './component/statistic/statistic.component';


const routes: Routes = [{
  path: 'statistic',
  component: StatisticComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule { }
