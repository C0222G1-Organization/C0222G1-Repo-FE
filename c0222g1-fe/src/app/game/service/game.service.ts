import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Game} from '../model/game';
import {environment} from '../../enviroment';
import {Observable} from 'rxjs';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }
  createGame(game: Game): Observable<any> {
    return this.http.post<any>(API_URL + '/games', game);
  }

  updateGame(id: number, game: Game): Observable<Game> {
    console.log('check 2:' + id);
    return this.http.put<Game>(API_URL + `/games/${id}`, game);
  }
  findById(id: number): Observable<Game> {
    return this.http.get<Game>(API_URL + `/games/${id}`);
  }

  getAllGames(page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games?page=${page}`);
  }

  searchGameByName(name: string, page: number): Observable<Game[]> {
    return this.http.get<Game[]>(API_URL + `/games/search?name=${name}&page=${page}`);
  }

  deleteGameById(id: number): Observable<Game> {
    return this.http.delete<Game>(API_URL + `/games/${id}`);
  }
  getGameById(id: string): Observable<Game> {
    return this.http.get<Game>(API_URL + `/games/detail/${id}`);
  }
}
