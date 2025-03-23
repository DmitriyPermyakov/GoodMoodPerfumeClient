import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderItem } from '../interfaces/app-interfaces';
import { TelegramService } from '../services/telegram.service';
import { Router } from '@angular/router';
import { of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  public items: OrderItem[]

  private navigateToContacts = () => this.router.navigate(['/contacts'])
  private itemSubscription: Subscription
  private itemSubject: Subject<number> = new Subject()

  constructor(private cartService: CartService,
    private tgService: TelegramService,
    private router: Router
  ) {}

 

  ngOnInit(): void {
    this.items = this.cartService.getOrderItems()
    this.tgService.backButton.show()
    this.tgService.mainButton.setParams({ text: 'Заказать' })
    this.tgService.mainButton.onClick(this.navigateToContacts)


    this.itemSubscription = this.itemSubject.subscribe(count => {
      if(count > 0)
        this.tgService.enableMainButton()        
      else
        this.tgService.disableMainButton()        
    })
   
    this.itemSubject.next(this.items.length)

  }

  ngOnDestroy(): void {
    this.tgService.mainButton.offClick(this.navigateToContacts)
    this.tgService.mainButton.setParams(
      { 
        is_active: true,
        color: '#AA60C8'
      })
    if(this.itemSubscription)
      this.itemSubscription.unsubscribe()
  }

  public getTotalCount(): number {    
    return this.cartService.totalCount();
  }

  public increaseCount(id: number): void {
    this.cartService.increaseItemCount(id);
    this.itemSubject.next(this.items.length)

  }

  public decreaseCount(id: number): void {
    this.cartService.decreaseItemCount(id)
    this.itemSubject.next(this.items.length)
  }

  public removeItem(id: number): void {
    this.cartService.removeItem(id)
    this.items = this.cartService.getOrderItems()
    this.itemSubject.next(this.items.length)
  }
}

