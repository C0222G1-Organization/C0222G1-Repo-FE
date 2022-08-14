import { Injectable } from '@angular/core';
import {Ilogin} from '../model/ilogin';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  URL_API = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient, private toartrs: ToastrService, private router: Router) { }

  requestLogin(login: Ilogin): Observable<any> {
    return this.httpClient.post<Ilogin[]>(this.URL_API + 'api/auth/login', login);
  }

  requestTest(): Observable<any> {
    return this.httpClient.get<Ilogin[]>(this.URL_API + 'api/auth/data/data1');
  }

  logout() {
    sessionStorage.clear();
    this.toartrs.success('Đã đăng xuất', 'THÔNG BÁO');
    this.router.navigate(['']);
  }
}
