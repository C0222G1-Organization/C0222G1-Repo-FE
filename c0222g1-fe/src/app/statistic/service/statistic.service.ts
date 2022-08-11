import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  API_URL_COMPUTER = 'http://localhost:8080/statistic/by-computer';
  API_URL_MONTH = 'http://localhost:8080/statistic/by-month';
  httpOptions: any;

  constructor(public httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      , 'Access-Control-Allow-Origin': 'http://localhost:4200', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    };
  }
  getStatisticByComputer(startDate: string, endDate: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<any>(this.API_URL_COMPUTER + '/' + startDate + '/' + endDate, this.httpOptions);
  }
  getStatisticByMonth(startDate: string, endDate: string): Observable<HttpEvent<any>> {
    return this.httpClient.get<any>(this.API_URL_MONTH + '/' + startDate + '/' + endDate, this.httpOptions);
  }
}
