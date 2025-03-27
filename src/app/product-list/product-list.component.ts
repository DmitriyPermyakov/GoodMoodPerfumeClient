import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../interfaces/app-interfaces';
import { ProductService } from '../services/product.service';
import { catchError, Subscription, throwError } from 'rxjs';
import { CartService } from '../services/cart.service';
import { TelegramService } from '../services/telegram.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  public products: Product[] = []

  private navigateToCart = () => this.router.navigate(['cart'])
  private activeFilter: string = "женские"
  private productSubscription: Subscription | null

  constructor(private productService: ProductService,
    private cartService: CartService,
    private tgService: TelegramService,
    private router: Router) {}

  public trackById(index: number, product: Product) {
    return product.id
  }


  ngOnInit(): void {
    console.log(this.tgService.startParams)
    this.loadProducts(this.activeFilter);
    this.tgService.backButton.hide();
    this.tgService.mainButton.onClick(this.navigateToCart)
    this.tgService.mainButton.setParams({
      text: 'Корзина'
    })
    if(!this.cartService.isCartEmpty()) {
      this.tgService.mainButton.show()
    }
  }

  ngOnDestroy(): void {
    this.tgService.mainButton.offClick(this.navigateToCart)
  }

  public isForWomen(): boolean {
    if(this.activeFilter === "женские")
      return true;
    else return false
  }

  public search(input: HTMLInputElement): void {
     this.productService.getProductsByName(input.value)
      .subscribe(p => this.products = p);
  }
  
  public filter(event: Event): void {
    this.activeFilter = (event.target as HTMLElement).textContent.toLocaleLowerCase();  
    
    this.loadProducts(this.activeFilter)
  }

  private loadProducts(category: string):void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe()

    this.productSubscription = this.productService.getFilteredProducts(category)
      .pipe(
        catchError(e => {
          alert("Cant get products" + e.message)
          return throwError(() => e)
        })
      )
      .subscribe(p => this.products = p.filter(p => p.category == this.activeFilter))

  }
}
