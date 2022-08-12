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

  // editCustomer(id: string, customer: ICustomer): Observable<any> {
  //   return this.http.patch(this.baseUrl + '/' + id, customer);
  // }

}
