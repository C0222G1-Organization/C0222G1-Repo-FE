import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { StatisticRoutingModule } from './statistic-routing.module';
import {StatisticComponent} from './component/statistic/statistic.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [StatisticComponent],
  imports: [
    CommonModule,
    StatisticRoutingModule,
    ReactiveFormsModule,
  ], providers: [DatePipe],
})
export class StatisticModule { }
