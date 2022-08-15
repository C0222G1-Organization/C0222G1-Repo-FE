import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {CustomerDTO} from '../model/customerDTO';
import {Observable} from 'rxjs';
import {Customer} from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // tslint:disable-next-line:variable-name
  ApiUrl_8080 = `${environment.apiUrl}/customer`;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Create by: TrungTHQ
   * Date Create: 11/08/2022
   * function: get list  customer  from database
   */

  public getAllCustomer(page, address, name, startDay, endDay, activeStatus): Observable<CustomerDTO> {
    return this.httpClient.get<CustomerDTO>('http://localhost:8080/customer/searchCustomer?page=' + page
      + '&address=' + address + '&name=' + name + '&starDay=' + startDay + '&endDay=' + endDay + '&activeStatus=' + activeStatus);
  }

  /**
   * Create by: TrungTHQ
   * Date Create: 11/08/2022
   * function: Delete customer by id
   */
  public deleteCustomerById(id): Observable<Customer> {
    return this.httpClient.delete<Customer>('http://localhost:8080/customer/deleteCustomerBy?id=' + id);
  }


  /**
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: get info of customer by id from database
   */
  public findCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.ApiUrl_8080}/${id}`);
  }

}
