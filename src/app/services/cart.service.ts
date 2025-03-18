import { Injectable } from '@angular/core';
import { OrderItem } from '../interfaces/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private orderItems: OrderItem[] = []

  private getOrderItemById(id: number): OrderItem | null {
    return this.orderItems.find(i => i.productId === id) ?? null
  } 

  public increaseItemCount(id: number): void {
    let item = this.getOrderItemById(id)
    if(item)
      item.quantity++    
  }

  public decreaseItemCount(id): void {
    let item = this.getOrderItemById(id)
    if(item)
      item.quantity--
  }

  public addItem(id: number): void {
    let item = this.getOrderItemById(id)
    if(item)
      item.quantity++;
    else
      this.orderItems.push({ productId: id, quantity : 1 })
  }
  constructor() { }
}
