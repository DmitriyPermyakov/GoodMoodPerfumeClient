import { Injectable } from '@angular/core';
import { OrderRequest } from '../interfaces/app-interfaces';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Response } from '../interfaces/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  public createOrder(orderRequest: OrderRequest): Observable<Response> {
    // return this.http.post<Response>('localhost:5070/api/Order/create', orderRequest)
    let response: Response = {
      status: 'OK',
      isSuccessfull: true,
      errors: [],
      result: orderRequest      
    }
    
    return of(response)
  }
}
