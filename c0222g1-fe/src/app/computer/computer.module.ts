import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComputerRoutingModule } from './computer-routing.module';
import { ComputerListComponent } from './component/computer-list/computer-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ComputerListComponent],
  imports: [
    CommonModule,
    ComputerRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class ComputerModule { }
