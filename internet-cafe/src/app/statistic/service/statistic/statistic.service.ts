import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  API_URL_COMPUTER = `${environment.apiUrl}` + '/statistic/by-computer';
  API_URL_MONTH = `${environment.apiUrl}` + '/statistic/by-month';
  API_URL_ACCOUNT = `${environment.apiUrl}` + '/statistic/by-account';
  httpOptions: any;

  constructor(public httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      ,
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    };
  }

  getStatisticByComputer(startDate: string, endDate: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<any>(this.API_URL_COMPUTER + '/' + startDate + '/' + endDate, this.httpOptions);
  }

  getStatisticByMonth(startDate: string, endDate: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<any>(this.API_URL_MONTH + '/' + startDate + '/' + endDate, this.httpOptions);
  }

  getStatisticByAccount(startDate: string, endDate: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<any>(this.API_URL_ACCOUNT + '/' + startDate + '/' + endDate, this.httpOptions);
  }
}
