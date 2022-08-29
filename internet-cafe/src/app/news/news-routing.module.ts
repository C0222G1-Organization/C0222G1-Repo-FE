import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewsComponent} from './component/news/news.component';
import {DetailComponent} from './component/detail/detail.component';
import {CreateComponent} from './component/create/create.component';
import {NotFoundComponent} from '../common-component/not-found/not-found.component';
import {GameCreateComponent} from "../game/component/game-create/game-create.component";
import {AuthGuardEmployeeAdminService} from "../authentication/service/auth-guard-employee-admin.service";

const routes: Routes = [
  {path: 'news' , component: NewsComponent, pathMatch: 'full'},
  {path: 'news/detail/:id' , component: DetailComponent, pathMatch: 'full'},
  {
    path: 'news/create',
    component: CreateComponent,
    canActivate: [AuthGuardEmployeeAdminService]
  },
  {path: 'news/**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NewsRoutingModule {}
