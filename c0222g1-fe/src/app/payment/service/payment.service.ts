import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  URL_API_PAYMENT = 'http://localhost:8080/payment';

  constructor(private httpClient: HttpClient) {
  }

  getAllPayment(): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.URL_API_PAYMENT + '/list');
  }

  getById(id: number): Observable<Payment> {
    return this.httpClient.get<Payment>(this.URL_API_PAYMENT + '/' + id);
  }

  setStatePayment(id: number): Observable<void> {
    return this.httpClient.get<void>(this.URL_API_PAYMENT + '/changes/' + id);
  }
}
