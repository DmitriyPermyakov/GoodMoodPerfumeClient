import { Injectable } from '@angular/core';
import { Product } from '../interfaces/app-interfaces';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {  
  private products: Product[] = [
    {
      id: 1,
      name: "Loreal",
      description: "some description for best product",
      price: 1200,
      category: "мужские",
      imageUrl: "../../assets/images/EX_237251b4-b770-4b0c-8bee-7b95748190b1.webp"
    },
    {
      id: 2,
      name: "Loreal Paris",
      description: "some description for best product",
      price: 3200,
      category: "женские",
      imageUrl: "../../assets/images/AUX_3234c6f2-9383-4687-8d1b-496b8a447cc6.webp"
    },
    {
      id: 3,
      name: "Beluchi",
      description: "some description for best product",
      price: 1900,
      category: "мужские",
      imageUrl: "../../assets/images/EX_237251b4-b770-4b0c-8bee-7b95748190b1.webp"
    },
    {
      id: 4,
      name: "Huyuchi",
      description: "some description for best product",
      price: 1700,
      category: "женские",
      imageUrl: "../../assets/images/AUX_3234c6f2-9383-4687-8d1b-496b8a447cc6.webp"
    },
    {
      id: 5,
      name: "Berlin Paris",
      description: "some description for best product",
      price: 4200,
      category: "мужские",
      imageUrl: "../../assets/images/EX_237251b4-b770-4b0c-8bee-7b95748190b1.webp"
    },
    {
      id: 6,
      name: "Some thing",
      description: "some description for best product",
      price: 1200,
      category: "женские",
      imageUrl: "../../assets/images/AUX_3234c6f2-9383-4687-8d1b-496b8a447cc6.webp"
    },
    {
      id: 7,
      name: "Crockodile",
      description: "some description for best product",
      price: 3200,
      category: "мужские",
      imageUrl: "../../assets/images/EX_237251b4-b770-4b0c-8bee-7b95748190b1.webp"
    },
    {
      id: 8,
      name: "Belisimo",
      description: "some description for best product",
      price: 11200,
      category: "женские",
      imageUrl: "../../assets/images/AUX_3234c6f2-9383-4687-8d1b-496b8a447cc6.webp"
    }
  ]
  constructor() { }

  public getFilteredProducts(category: string): Observable<Product[]> {
    return of(this.products)
  }

  public getProductsByName(name: string) : Observable<Product[]> {
    return of(this.products.filter(p => p.name.toLocaleLowerCase().includes(name)))
  }
}
