import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {Customer} from '../model/customer';
import {Observable} from 'rxjs';
import { UpdateCustomerDto } from '../model/customer-update-dto';
import { Province } from '../model/province';
import { District } from '../model/district';
import { Commune } from '../model/commune';

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
   * Create by: DuyNT
   * Date Create: 11/08/2022
   * function: get info of customer by id from database
   */
  public findCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.ApiUrl_8080}/${id}`);
  }

  saveCustomer(customerDTO: UpdateCustomerDto): Observable<void> {
    console.log(customerDTO);
    return this.httpClient.post<void>(this.ApiUrl_8080 , customerDTO);
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

  updateCustomer(id: number, customer: Customer): Observable<UpdateCustomerDto> {
    return this.httpClient.patch<UpdateCustomerDto>(this.ApiUrl_8080 + '/' + id , customer);
  }

  checkUserName(userName: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkUserName/' + userName);
  }

  checkEmail(email: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkEmail/' + email);
  }

  checkPhone(phone: string): Observable<string> {
    return this.httpClient.get<string>(this.ApiUrl_8080 + '/checkPhone/' + phone);
  }
}
