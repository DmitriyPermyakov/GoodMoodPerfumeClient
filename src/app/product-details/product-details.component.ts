import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/app-interfaces';
import { catchError, map, Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { TelegramService } from '../services/telegram.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  @Input() public product: Product | null
  private productSubscription: Subscription
  public isAuth: boolean = false
  
  public itemsCount(): number {
    return this.cartService.itemsCount()
  }

  
  constructor(private productService: ProductService, 
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private cartService: CartService,
    private tgService: TelegramService,
    private cdr: ChangeDetectorRef) {
      this.isAuth = auth.isTokenValid()
    }
    
  public isCartEmpty(): boolean {
    return this.cartService.isCartEmpty()
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id")
    
    if(!this.product)      
      this.productSubscription = this.productService.getProductById(parseInt(id))
        .pipe(
          catchError(e => {
            this.messageService.showMessage(false, "Не удалось получить продукт")
            return throwError(() => e)
          })          
        )
        .subscribe(r => {
          this.product = (r.result as Product) ?? null
        })

    if(this.isAuth) {
      this.tgService.mainButton.setParams({
        text: "Редактировать"
      })
      this.tgService.mainButton.onClick(this.navigateToEditCallback)
    } else {
      this.tgService.mainButton.setParams({
        text: "Добавить в корзину"
      })
      this.tgService.mainButton.onClick(this.addToCartCallback)
    }    

    this.tgService.mainButton.show()
    this.tgService.backButton.show()

  }

  navigateToEditCallback = () => this.navigateToEdit()
  navigateToEdit(): void {
    this.router.navigate(['product', this.product.id, 'edit'])
  }

  addToCartCallback = () => this.addToCart()

  addToCart(): void {
    this.cartService.addItem(this.product)
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe()
    if(this.isAuth)
      this.tgService.mainButton.offClick(this.navigateToEditCallback)
    else 
      this.tgService.mainButton.offClick(this.addToCartCallback)
  }

  
}
