import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeCreateComponent } from './component/employee-create/employee-create.component';


@NgModule({
    declarations: [EmployeeCreateComponent],
    exports: [
        EmployeeCreateComponent
    ],
    imports: [
        CommonModule,
        EmployeeRoutingModule
    ]
})
export class EmployeeModule { }
