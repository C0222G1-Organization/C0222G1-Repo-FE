import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {CustomerDTO} from '../model/customerDTO';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // tslint:disable-next-line:variable-name
  ApiUrl_8080 = `${environment.apiUrl}/customer`;

  constructor(private httpClient: HttpClient) {
  }

  public getAllCustomer(page, address, name, startDay, endDay, activeStatus): Observable<CustomerDTO> {
    return this.httpClient.get<CustomerDTO>('http://localhost:8080/customer/searchCustomer?page=' + page
      + '&address=' + address + '&name=' + name + '&starDay=' + startDay + '&endDay=' + endDay + '&activeStatus=' + activeStatus);
  }
  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: get info of customer by id from database
   */

}
