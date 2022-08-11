import { Injectable } from '@angular/core';
import {environment} from "../../enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Game} from "../model/game";

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) { }

  getAllPopularGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/popular?page=${page}`);
  }

  getAllNewGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/new?page=${page}`);
  }

  getAllHotGame(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/hot?page=${page}`);
  }
}
