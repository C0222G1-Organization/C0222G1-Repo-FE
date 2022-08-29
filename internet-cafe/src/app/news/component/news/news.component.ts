import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../service/news.service';
import {News} from '../../model/news';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

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
  createState = false;

  constructor(private newsService: NewsService, private toastr: ToastrService, private route: Router, private title: Title) {
    this.title.setTitle('Tin tức game');
  }

  ngOnInit(): void {
    this.getAllTopNews();
    this.getAllNews();
    this.checkRole();
  }

  getAllTopNews() {
    this.newsService.getAllNews(0, this.searchTitle).subscribe((value: any) => {
        this.topNews = value.content;
      }
    );
  }

  getAllNews() {
    this.newsService.getAllNews(this.page, this.searchTitle).subscribe((value: any) => {
        this.listNews = value.content;
        this.totalItems = value.totalElements;
        console.log(this.page);
      }
    );
  }

  getPage(page) {
    this.page = page;
    page = page - 1;
    this.newsService.getAllNews(page, this.searchTitle).subscribe((value: any) => {
      this.listNews = value.content;
      console.log('phân trang' + this.page);
      this.totalItems = value.totalElements;
    });
  }

  updateViews(id) {
    this.newsService.updateViews(id).subscribe(
      value => {
      },
      error => {
      },
      () => {
        this.route.navigateByUrl(`news/detail/${id}`);
      }
    );
  }

  search() {
    if (this.page > 0) {
      this.page = 0;
    }
    this.searchTitle = this.searchTitle.trim();
    if (this.searchTitle === '') {
      this.getAllNews();
      return;
    }
    this.newsService.getAllNews(0, this.searchTitle).subscribe((value: any) => {
        this.listNews = value.content;
        this.totalItems = value.totalElements;
        if (value.content == null) {
          this.toastr.success('không tìm thấy kết quả');
        }
        console.log(this.listNews);
      },
    );
  }

  checkRole() {
    if (sessionStorage.getItem('roles') === 'EMPLOYEE' || sessionStorage.getItem('roles') === 'ADMIN') {
      this.createState = true;
    }
    if (sessionStorage.getItem('roles') === 'CUSTOMER') {
      this.createState = false;
    }
  }
}
