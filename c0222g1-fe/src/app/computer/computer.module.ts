import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComputerRoutingModule } from './computer-routing.module';
import { ComputerCreateComponent } from './component/computer-create/computer-create.component';
import { ComputerEditComponent } from './component/computer-edit/computer-edit.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ComputerCreateComponent, ComputerEditComponent],
    imports: [
        CommonModule,
        ComputerRoutingModule,
        ReactiveFormsModule
    ]
})
export class ComputerModule { }
