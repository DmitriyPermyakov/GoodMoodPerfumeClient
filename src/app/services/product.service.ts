import { Injectable } from '@angular/core';
import { Response } from '../interfaces/app-interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductService {  
  private url: string = environment.url + "/api/Products"
 
  constructor(private http: HttpClient) { }

  public getFilteredProducts(category: string): Observable<Response> {
    const params = new HttpParams().set('category', category.toLowerCase())
    return this.http.get<Response>(`${this.url}/getByCategory`, {params})
  }

  public getProductById(id: number) : Observable<Response> {
    return this.http.get<Response>(`${this.url}/getById/${id}`)
  }

  public getProductsByName(name: string) : Observable<Response> {
    const params = new HttpParams().set('name', name.toLowerCase())
    return this.http.get<Response>(`${this.url}/getByName`, { params })
  }

  public updateProduct(formData: FormData): Observable<Response> {
    return this.http.put<Response>(`${this.url}/update`, formData)
  }

  public createProduct(formData: FormData): Observable<Response> {    
    return this.http.post<Response>(`${this.url}/create`, formData)
  }
}
