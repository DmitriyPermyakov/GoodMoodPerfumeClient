import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../interfaces/app-interfaces';
import { ProductService } from '../services/product.service';
import { catchError, debounceTime, distinctUntilChanged, Subscription, switchMap, throwError } from 'rxjs';
import { CartService } from '../services/cart.service';
import { TelegramService } from '../services/telegram.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  public products: Product[] = []
  public search: FormControl = new FormControl('')

  private navigateToCartCallback = () => this.router.navigate(['cart'])
  private navigateToCreateCallback = () => this.router.navigate(['product', 'create'])
  private activeFilter: string = "женские"
  private productSubscription: Subscription | null
  private searchSub: Subscription
  private isAuth: boolean = false

  constructor(private productService: ProductService,
    private cartService: CartService,
    private tgService: TelegramService,
    private messageService: MessageService,
    private router: Router,
    private auth: AuthService) {
      this.isAuth = auth.isTokenValid()
    }

  public trackById(index: number, product: Product) {
    return product.id
  }


  ngOnInit(): void {
    this.loadProducts(this.activeFilter);
    this.tgService.backButton.hide();

    if(this.isAuth) {
      this.tgService.mainButton.onClick(this.navigateToCreateCallback)
      this.tgService.mainButton.setParams({
        text: 'Добавить'
      }) 
      this.tgService.mainButton.show() 
    }
    else {
      this.tgService.mainButton.onClick(this.navigateToCartCallback)
      this.tgService.mainButton.setParams({
        text: 'Корзина'
      })    
      if(!this.cartService.isCartEmpty()) {
        this.tgService.mainButton.show()
      }
    }    

    this.setSearch()

  }

  ngOnDestroy(): void {
    if(this.isAuth)
      this.tgService.mainButton.offClick(this.navigateToCreateCallback)
    else
      this.tgService.mainButton.offClick(this.navigateToCartCallback)
  }

  public isForWomen(): boolean {
    if(this.activeFilter === "женские")
      return true;
    else return false
  }

  public filter(event: Event): void {
    this.activeFilter = (event.target as HTMLElement).textContent.toLocaleLowerCase();  
    
    this.loadProducts(this.activeFilter)
  }

  private setSearch(): void {
    this.searchSub = this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          let name = (value as string).trim().toLowerCase()
           return this.productService.getProductsByName(name)
        })
      ).subscribe(r => {
        this.products = r.result as Product[]
      })
  }

  private loadProducts(category: string):void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe()

    this.productSubscription = this.productService.getFilteredProducts(category)
      .pipe(
        catchError(e => {
          this.messageService.showMessage(false, "Ошибка загрузки")
          return throwError(() => e)
        })
      )
      .subscribe(r => {
        if(r.result){
          this.products = r.result as Product[]
        }
      })

  }
}
