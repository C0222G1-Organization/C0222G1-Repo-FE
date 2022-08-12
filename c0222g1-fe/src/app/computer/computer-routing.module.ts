import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComputerCreateComponent} from "./component/computer-create/computer-create.component";
import {ComputerEditComponent} from "./component/computer-edit/computer-edit.component";


const routes: Routes = [
  {path: 'computer/create-computer', component: ComputerCreateComponent},
  {path: 'computer/edit-computer/:id', component: ComputerEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputerRoutingModule { }
