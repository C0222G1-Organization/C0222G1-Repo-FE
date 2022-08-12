import { Injectable } from '@angular/core';
import {Ilogin} from '../model/ilogin';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL_API = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  requestLogin(login: Ilogin): Observable<any> {
    return this.httpClient.post<Ilogin[]>(this.URL_API + 'api/auth/login', login);
  }
}
