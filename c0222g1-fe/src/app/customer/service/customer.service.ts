import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {Customer} from '../model/customer';
import {Observable} from 'rxjs';
import {Province} from '../model/province';
import {District} from '../model/district';
import {Commune} from '../model/commune';
import {UpdateCustomerDto} from '../model/customer-update-dto';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // tslint:disable-next-line:variable-name
  ApiUrl_8080 = `${environment.apiUrl}/customer`;

  constructor(private httpClient: HttpClient) {
  }

  saveCustomer(customerDTO: UpdateCustomerDto): Observable<void> {
    console.log(customerDTO);
    return this.httpClient.post<void>(this.ApiUrl_8080 , customerDTO);
  }

  findCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.ApiUrl_8080}/${id}`);
  }
  getAllProvince(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.ApiUrl_8080 + '/address/province');
  }

  getAllDistrict(provinceId: number): Observable<District[]> {
    return this.httpClient.get<District[]>(this.ApiUrl_8080 + '/address/district/' + provinceId);
  }

  getAllCommune(districtId: number): Observable<Commune[]> {
    return this.httpClient.get<Commune[]>(this.ApiUrl_8080 + '/address/commune/' + districtId);
  }
  getCustomerByID(id: number): Observable<UpdateCustomerDto> {
    return this.httpClient.get<UpdateCustomerDto>(this.ApiUrl_8080 + '/getCustomer/' + id);
  }

  updateCustomer(id: number, customer: Customer): Observable<UpdateCustomerDto> {
    return this.httpClient.patch<UpdateCustomerDto>(this.ApiUrl_8080 + '/' + id , customer);
  }

}
