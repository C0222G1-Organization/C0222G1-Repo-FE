import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {News} from '../model/news';
import {GameCategory} from '../model/game-category';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient) { }

  getAllNews(page: number, title: string): Observable<News[]> {
    if (title == null) {title = ''; }
    return this.httpClient.get<News[]>(API_URL + `/news?page=${page}&title=${title}`);
  }

  getAllGameCate(): Observable<GameCategory[]> {
    return this.httpClient.get<GameCategory[]>(API_URL + `/games/game-categories`);
  }

  createNews(news: News): Observable<News> {
    return this.httpClient.post<News>(API_URL + '/news', news);
  }

  getNews(id: string): Observable<News> {
    return this.httpClient.get<News>(API_URL + `/news/detail/${id}`);
  }

  updateViews(id: string): Observable<void> {
    console.log(id);
    return this.httpClient.get<void>(API_URL + `/news/update-views?id=${id}`);
  }
}
