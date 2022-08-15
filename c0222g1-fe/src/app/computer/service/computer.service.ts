import {Injectable} from '@angular/core';
import {environment} from '../../enviroment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SearchDto} from '../model/search-dto';
import {ComputerType} from '../model/computer-type';
import {Computer} from '../model/computer';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private http: HttpClient) {
  }

  /**
   * Created by: PhucNQ
   * Date created: 10/08/2022
   * Function: findAll
   */
  createComputer(computer: Computer): Observable<Computer> {
    return this.http.post<Computer>(API_URL + '/computers/create', computer);
  }


  findById(id: number) {
    return this.http.get<Computer>(API_URL + `/computers/list/${id}`);
  }

  editComputer(id: number, computer: Computer) {
    return this.http.patch<Computer>(API_URL + `/computers/edit/${id}`, computer);
  }

  /**
   * Created by: PhucNQ
   * Date created: 10/08/2022
   * Function: delete(id)
   */
  findAll(page: number,
          code: string,
          location: string,
          start: string,
          end: string,
          status: string,
          typeId: string): Observable<SearchDto[]> {
    if (start === '') {
      start = '1900-10-10';
    }
    if (end === '') {
      end = '2200-10-10';
    }
    let params = new HttpParams();
    params = params.append('code', code);
    params = params.append('location', location);
    params = params.append('start', start);
    params = params.append('end', end);
    params = params.append('status', status);
    params = params.append('typeId', typeId);
    return this.http.get<SearchDto[]>(API_URL + `/computers/${page}`, {params});
  }

  /**
   * Created by: PhucNQ
   * Date created: 10/08/2022
   * Function: delete(id)
   */
  delete(id): Observable<void> {
    return this.http.delete<void>(`${API_URL}/computers/${id}`);
  }

  /**
   * Created by: PhucNQ
   * Date created: 14/08/2022
   * Function: getAll(id)
   */
  getAll(): Observable<ComputerType[]> {
    return this.http.get<ComputerType[]>(API_URL + '/computers/list/computer-type');
  }

}
