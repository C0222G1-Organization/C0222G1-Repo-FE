import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {CustomerDTO} from '../model/customerDTO';
import {Observable} from 'rxjs';
import {Customer} from '../model/customer';
import {UpdateCustomerDto} from '../model/customer-update-dto';
import {Province} from '../model/province';
import {District} from '../model/district';
import {Commune} from '../model/commune';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // tslint:disable-next-line:variable-name
  ApiUrl_8080 = `${environment.apiUrl}/customer`;
  ApiUrl = `${environment.apiUrl}/address`;

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

  saveCustomer(customerDTO: UpdateCustomerDto): Observable<void> {
    console.log(customerDTO);
    return this.httpClient.post<void>(this.ApiUrl_8080, customerDTO);
  }

  getAllProvince(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.ApiUrl + '/province');
  }

  getAllDistrict(provinceId: number): Observable<District[]> {
    return this.httpClient.get<District[]>(this.ApiUrl + '/district/' + provinceId);
  }

  getAllCommune(districtId: number): Observable<Commune[]> {
    return this.httpClient.get<Commune[]>(this.ApiUrl + '/commune/' + districtId);
  }

  getCustomerByID(id: number): Observable<UpdateCustomerDto> {
    return this.httpClient.get<UpdateCustomerDto>(this.ApiUrl_8080 + '/getCustomer/' + id);
  }

  updateCustomerDTO(id: number, customer: UpdateCustomerDto): Observable<UpdateCustomerDto> {
    return this.httpClient.patch<UpdateCustomerDto>(this.ApiUrl_8080 + '/' + id, customer);
  }

  checkUserName(userName: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkUserName/' + userName);
  }

  checkUserNameInEdit(userName: string, id: number): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkUserNameInEdit/' + userName + '/' + id);
  }

  checkEmail(email: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkEmail/' + email);
  }

  checkPhone(phone: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkPhone/' + phone);
  }

  updateCustomerInfo(id: number, customer: CustomerDTO): Observable<void> {
    return this.httpClient.patch<void>(this.ApiUrl_8080 + '/update/' + id, customer);
  }

  checkMatchesPassword(password: string, id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(this.ApiUrl_8080 + '/matchesPassword/' + password + '/' + id);
  }

  /**
   * Create by: LuanND
   * Date Create: 17/08/2022
   * Description: add new time remaining
   * @param id: is ID object payment send to API
   * @param remaining: time remaining customer can play
   */
  setTimeRemaining(id: number, remaining: number): Observable<any> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + `/setOutOfTime?id=${id}&remaining=${remaining}`);
  }
}

