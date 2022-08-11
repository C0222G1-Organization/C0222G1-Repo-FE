import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './component/news/news.component';
import { CreateComponent } from './component/create/create.component';
import { DetailComponent } from './component/detail/detail.component';
import {NewsService} from './service/news.service';


@NgModule({
  declarations: [NewsComponent, CreateComponent, DetailComponent],
  imports: [
    CommonModule,
    NewsRoutingModule
  ],
  providers: [NewsService]
})
export class NewsModule { }
