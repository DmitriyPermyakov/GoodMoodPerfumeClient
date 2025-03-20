import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderItem } from '../interfaces/app-interfaces';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public items: OrderItem[]
  constructor(private cartService: CartService) {}

  public getTotalCount(): number {    
    return this.cartService.totalCount();
  }

  ngOnInit(): void {
    this.items = this.cartService.getOrderItems()
  }

  public increaseCount(id: number): void {
    this.cartService.increaseItemCount(id);
  }

  public decreaseCount(id: number): void {
    this.cartService.decreaseItemCount(id)
  }

  public removeItem(id: number): void {
    this.cartService.removeItem(id)
    this.items = this.cartService.getOrderItems()

  }
}

