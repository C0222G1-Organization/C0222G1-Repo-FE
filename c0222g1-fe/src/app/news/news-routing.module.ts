import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewsComponent} from './component/news/news.component';
import {DetailComponent} from './component/detail/detail.component';
import {CreateComponent} from './component/create/create.component';

const routes: Routes = [
  {path: 'news' , component: NewsComponent, pathMatch: 'full'},
  {path: 'detail-news/:id' , component: DetailComponent, pathMatch: 'full'},
  {path: 'create-news' , component: CreateComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NewsRoutingModule {}
