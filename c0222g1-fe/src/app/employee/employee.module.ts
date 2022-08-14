import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './component/employee-list/employee-list.component';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [EmployeeListComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class EmployeeModule { }
