import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../model/Product';
import {ProductCategory} from '../model/ProductCategory';
import {environment} from '../../enviroment';
const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }
  //
  // private API = 'http://localhost:8080/product';
  // private API_CATE = 'http://localhost:8080/product/listCategory';

  findAllProduct(name: string, page: number): Observable<Product[]> {
    console.log(name);
    return this.http.get<Product[]>(API_URL + '/product/list?name=' + name + '&page=' + page);

  }

  findAllProductForOrder(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + '/product/order');
  }

  findAllProductCategory(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(API_URL + '/product/listCategory');
  }

  findProductListByCategoryId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + '/product/order/' + id);
  }


  delete(id: number): Observable<any> {
    return this.http.delete<any>(API_URL + '/product/list/delete/' + id);
  }

  deleteAll(id: number[]): Observable<any> {
    return this.http.delete<any>(API_URL + '/product/list/delete/' + id.length);
  }

  loadInfoProductById(id: number): Observable<Product> {
    return this.http.get<Product>(API_URL + '/product/' + id);
  }
  showListBestSeller(name: string, page: number): Observable<Product[]> {
    console.log(name);
    return this.http.get<Product[]>(API_URL + '/product/list-best-seller?name=' + name + '&page=' + page);
  }
  /**
   * Created: LuanND
   * Date: 17/08/2022
   * @param id: is ID of object payment to get list service
   */
  setDataProduct(id: number): Observable<void> {
    return this.http.get<void>(API_URL + '/product/data/' + id);
  }
}
