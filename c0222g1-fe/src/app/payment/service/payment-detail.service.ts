import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../../product/model/Product';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailService {
  private RECORD_API = 'http://localhost:8080/rerord';

  constructor(private http: HttpClient) {
  }


  loadInfoRecordById(id: number): Observable<Product> {
    return this.http.get<Product>(this.RECORD_API + '/' + id);
  }
}
