import { Injectable } from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() { }

  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq  = req;
    console.log(sessionStorage);
    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: sessionStorage.getItem('token'),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }
      });
    }
    console.log(authReq);
    return next.handle(authReq);
  }
}
