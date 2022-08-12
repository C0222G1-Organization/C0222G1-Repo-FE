import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Payment} from '../model/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  jsonArray: any;
  URL_API_PAYMENT = 'http://localhost:8080/payment';

  constructor(private httpClient: HttpClient) {
  }

  getAllPayment(): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.URL_API_PAYMENT + '/list');
  }

  sendJson(obj: any) {
    this.jsonArray = obj;
    console.log(this.jsonArray);
  }

  getJson(): any {
    return this.jsonArray;
  }

}
