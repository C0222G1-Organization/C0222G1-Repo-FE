import { Injectable } from '@angular/core';
import {Ilogin} from '../model/ilogin';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // @ts-ignore
  data = new BehaviorSubject<Map<string, any>>();
  checkData = this.data.asObservable();
  URL_API = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient, private toartrs: ToastrService, private router: Router) { }

  sendData(key: string, value: any) {
    const dataMap: Map<string, any> = new Map<string, any>();
    dataMap.set(key, value);
    this.data.next(dataMap);
  }

  requestLogin(login: Ilogin): Observable<any> {
    return this.httpClient.post<Ilogin[]>(this.URL_API + 'api/auth/login', login);
  }

  setOutOfTime(id: number, remaining: number ): Observable<any> {
    return this.httpClient.get<Ilogin[]>(this.URL_API + 'customer/setOutOfTime?id=' + id + '&remaining=' + remaining);
  }

  getRemainingTime(id: number): Observable<any> {
    return this.httpClient.get<Ilogin[]>(this.URL_API + 'customer/getRemainingTime/' + id);
  }
}
