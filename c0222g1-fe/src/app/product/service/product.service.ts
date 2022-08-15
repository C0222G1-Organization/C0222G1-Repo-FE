import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../model/Product';
import {ProductCategory} from '../model/ProductCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  private API = 'http://localhost:8080/product';
  private API_CATE = 'http://localhost:8080/product/listCategory';

  findAllProduct(name: string, page: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.API + '/list?name=' + name + '&page=' + page);
  }

  findAllProductForOrder(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API + '/order');
  }

  findAllProductCategory(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.API_CATE);
  }

  findProductListByCategoryId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.API + '/order/' + id);
  }


  delete(id: number): Observable<any> {
    return this.http.delete<any>(this.API + '/list/delete/' + id);
  }

  deleteAll(id: number[]): Observable<any> {
    return this.http.delete<any>(this.API + '/list/delete/' + id.length);
  }

  loadInfoProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.API + '/' + id);
  }
}
