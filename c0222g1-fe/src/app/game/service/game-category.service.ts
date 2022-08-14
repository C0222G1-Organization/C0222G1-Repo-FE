import { Injectable } from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameCategory} from '../model/game-category';
const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class GameCategoryService {

  constructor(private http: HttpClient ) { }
  getAll(): Observable<GameCategory[]> {
    return this.http.get<GameCategory[]>(API_URL + '/games/game-categories');
  }
}
