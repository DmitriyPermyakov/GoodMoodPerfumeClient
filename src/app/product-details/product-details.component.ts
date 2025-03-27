import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/app-interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { TelegramService } from '../services/telegram.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  @Input() public product: Product | null
  private productSubscription: Subscription
  
  public itemsCount(): number {
    return this.cartService.itemsCount()
  }

  
  constructor(private productService: ProductService, 
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private tgService: TelegramService,
    private cdr: ChangeDetectorRef) {}
    
  public isCartEmpty(): boolean {
    return this.cartService.isCartEmpty()
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id")
    if(!this.product)      
      this.productSubscription = this.productService.getProductById(parseInt(id))
        .subscribe(p => this.product = p ?? null)

    this.tgService.mainButton.setParams({
      text: "Добавить в корзину"
    })

    this.tgService.mainButton.onClick(this.addToCartCallback)
    this.tgService.mainButton.show()
    this.tgService.backButton.show()

  }

  addToCartCallback = () => this.addToCart()

  addToCart(): void {
    this.cartService.addItem(this.product)
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    if(this.productSubscription)
      this.productSubscription.unsubscribe()
    this.tgService.mainButton.offClick(this.addToCartCallback)
  }

  
}
