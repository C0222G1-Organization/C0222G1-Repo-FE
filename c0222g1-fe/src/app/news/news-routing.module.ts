import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewsComponent} from './component/news/news.component';
import {DetailComponent} from './component/detail/detail.component';
import {CreateComponent} from './component/create/create.component';

const routes: Routes = [
  {path: 'news' , component: NewsComponent},
  {path: 'detail-news' , component: DetailComponent},
  {path: 'create-news' , component: CreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule {}
