import {Injectable} from '@angular/core';
import {environment} from "../../enviroment";
import {Computer} from "../model/computer";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ComputerType} from "../model/computer-type";

const API_URL = `${environment.apiUrl}`

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(private http: HttpClient) {
  }

  createComputer(computer: Computer): Observable<Computer> {
    return this.http.post<Computer>(API_URL + '/create-computer', computer)
  }

  getAll(): Observable<Computer[]> {
    return this.http.get<Computer[]>(API_URL + '/list')
  }

  findById(id: number) {
    return this.http.get<Computer>(API_URL + `/list/${id}`)
  }

  editComputer(id: number, computer:Computer){
    return this.http.patch<Computer>(API_URL + `/edit-computer/${id}`,computer)
  }
}
