import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
// @ts-ignore
import {Game} from '../model/game';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  constructor(private http: HttpClient) { }

  getTopGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/top-3?page=${page}`);
  }

  getAllPopularGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/popular?page=${page}`);
  }

  getAllNewGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/new?page=${page}`);
  }

  getAllHotGame(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/hot?page=${page}`);
  }

  deleteGameById(id: number): Observable<Game> {
    return this.http.delete<Game>(API_URL + `/games/${id}`);
  }

  findById(id: number): Observable<Game> {
    return this.http.get<Game>(API_URL + `/games/${id}`);
  }

  updateGame(id: number, game: Game): Observable<Game> {
    return this.http.put<Game>(API_URL + `/games/${id}`, game);
  }
}
