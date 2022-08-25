import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Payment} from '../model/payment';
import {Record} from '../model/record';
import {ReponseBody} from '../model/reponse-body';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  URL_API_PAYMENT = 'http://localhost:8080/payment';
  URL_API_SEND_MAIL = 'http://localhost:8080/mail/send';

  constructor(private httpClient: HttpClient) {
  }

  getAllPayment(): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.URL_API_PAYMENT + '/list');
  }

  getAllPagePayment(page: number): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.URL_API_PAYMENT + `/display?page=${page}`);
  }

  sendEmail(reponseBody: ReponseBody): Observable<string> {
    return this.httpClient.post<string>(this.URL_API_SEND_MAIL, reponseBody);
  }

  getById(id: number): Observable<Payment> {
    return this.httpClient.get<Payment>(this.URL_API_PAYMENT + '/' + id);
  }

  setStatePayment(id: number): Observable<void> {
    return this.httpClient.get<void>(this.URL_API_PAYMENT + '/changes/' + id);
  }

  /**
   * Create by DuyNT
   * method save payment to DB after ordering
   * @return payment
   */
  savePayment(record: Record): Observable<Payment> {
    console.log('saving');
    return this.httpClient.post<Payment>(this.URL_API_PAYMENT + '/create', record);
  }

  searchPaymentByCode(code: string, page: number): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.URL_API_PAYMENT + `/search?page=${page}&code=${code}`);
  }
}
