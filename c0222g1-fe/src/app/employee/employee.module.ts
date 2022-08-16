import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';

import { EmployeeCreateComponent } from './component/employee-create/employee-create.component';
import {EmployeeListComponent} from './component/employee-list/employee-list.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [EmployeeListComponent, EmployeeCreateComponent],
    imports: [
        CommonModule,
        EmployeeRoutingModule,
        FormsModule,
        NgxPaginationModule,
        ReactiveFormsModule
    ]
})
export class EmployeeModule { }
