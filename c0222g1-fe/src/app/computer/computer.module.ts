import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComputerRoutingModule} from './computer-routing.module';
import {ComputerCreateComponent} from './component/computer-create/computer-create.component';
import {ComputerEditComponent} from './component/computer-edit/computer-edit.component';
import {ComputerListComponent} from './component/computer-list/computer-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ComputerCreateComponent, ComputerEditComponent,ComputerListComponent],
  imports: [
    CommonModule,
    ComputerRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class ComputerModule {
}
