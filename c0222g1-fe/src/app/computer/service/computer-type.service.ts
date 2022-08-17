import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ComputerType} from '../model/computer-type';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ComputerTypeService {

  constructor(private http: HttpClient) {
  }
  /**
   * Created by: TuanHD
   * Date created: 10/08/2022
   * Function: getAll
   */
  getAll(): Observable<ComputerType[]> {
    return this.http.get<ComputerType[]>(API_URL + '/computers/list/computer-type');
  }
}
