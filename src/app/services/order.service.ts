import { Injectable } from '@angular/core';
import { OrderRequest } from '../interfaces/app-interfaces';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Response } from '../interfaces/app-interfaces';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = environment.url
  constructor(private http: HttpClient) { }

  public createOrder(orderRequest: OrderRequest): Observable<Response> {
    return this.http.post<Response>(`${this.url}/api/Order/create`, orderRequest)   
  }

  public getOrderContacts(id: number): Observable<Response> {
    return this.http.get<Response>(`${this.url}/api/Order/getContacts/${id}`)
  }
}
