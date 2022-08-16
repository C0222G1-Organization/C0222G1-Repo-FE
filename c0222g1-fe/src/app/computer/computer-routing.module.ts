import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ComputerCreateComponent} from './component/computer-create/computer-create.component';
import {ComputerEditComponent} from './component/computer-edit/computer-edit.component';
import {ComputerListComponent} from './component/computer-list/computer-list.component';


const routes: Routes = [
  {
    path: 'computers', component: ComputerListComponent
    // admin, employee PhucNQ
  },
  {path: 'computers', component: ComputerListComponent},
  {
    path: 'computers/create', component: ComputerCreateComponent
    // admin TuanHD
  },
  {
    path: 'computers/edit/:id', component: ComputerEditComponent
    // admin TuanHD
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputerRoutingModule {
}
