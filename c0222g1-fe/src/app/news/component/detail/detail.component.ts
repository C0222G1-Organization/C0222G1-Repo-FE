import { Component, OnInit } from '@angular/core';
import {NewsService} from '../../service/news.service';
import {News} from '../../model/news';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  news: News;
  id: string;
  constructor(private newsService: NewsService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.newsService.getNews(this.id).subscribe(
      value => {this.news = value; }
    );
  }
}
