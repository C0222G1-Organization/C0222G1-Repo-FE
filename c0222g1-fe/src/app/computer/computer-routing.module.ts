import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComputerListComponent} from './component/computer-list/computer-list.component';


const routes: Routes = [
  {path: 'computers', component: ComputerListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputerRoutingModule { }
