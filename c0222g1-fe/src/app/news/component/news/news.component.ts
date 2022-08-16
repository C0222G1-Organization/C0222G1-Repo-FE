import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../service/news.service';
import {News} from '../../model/news';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  page = 1;
  totalItems: any;
  itemsPerPage = 3;
  listNews: News[];
  topNews: News[];
  searchTitle: string;

  constructor(private newsService: NewsService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllTopNews();
    this.getAllNews();
  }

  getAllTopNews() {
    this.newsService.getAllNews(0, this.searchTitle).subscribe((value: any) => {
        this.topNews = value.content;
        console.log(this.topNews);
      }
    );
  }

  getAllNews() {
    this.newsService.getAllNews(0, this.searchTitle).subscribe((value: any) => {
      this.listNews = value.content;
      this.totalItems = value.totalElements;
      console.log(this.listNews);
      }
    );
  }

  getPage(page) {
    this.page = page;
    page = page - 1;
    this.newsService.getAllNews(page, this.searchTitle).subscribe((value: any) => {
      this.listNews = value.content;
      console.log(value);
      this.totalItems = value.totalElements;
    });
  }

  updateViews(id) {
    this.newsService.updateViews(id).subscribe();
  }

  search() {
    if (this.searchTitle === '') {
          this.getAllNews();
          return;
        }
    this.searchTitle = this.searchTitle.trim();
    this.newsService.getAllNews(0, this.searchTitle).subscribe((value: any) => {
        this.listNews = value.content;
        this.totalItems = value.totalElements;
        console.log(this.listNews);
      }
    );
  }
}
