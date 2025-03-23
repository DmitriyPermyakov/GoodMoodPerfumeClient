import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Subject, Subscription, throwError } from 'rxjs';


import { TelegramService } from '../services/telegram.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { OrderItemsRequest, OrderRequest } from '../interfaces/app-interfaces';
import { Response } from '../interfaces/app-interfaces';

@Component({
  selector: 'app-enter-contacts',
  templateUrl: './enter-contacts.component.html',
  styleUrls: ['./enter-contacts.component.css']
})
export class EnterContactsComponent implements OnInit, OnDestroy {
  public isSelectOpen: boolean = false
  
  private validSub: Subscription
  private contactSub: Subscription
  private validSubject: Subject<boolean> = new Subject()

  public contacts = new FormGroup({
    delivery: new FormControl('CDEK', Validators.required),
    name: new FormControl('', [Validators.maxLength(64), Validators.minLength(2), Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(5)]),
    address: new FormControl('', [Validators.required, Validators.maxLength(255) ])
  })

  constructor(private tgService: TelegramService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.contactSub = this.contacts.statusChanges.subscribe(v => {
      this.validSubject.next(this.contacts.valid)
    })

    this.tgService.disableMainButton()
    this.tgService.mainButton.onClick(this.submitCallback)

    this.validSub = this.validSubject.subscribe(valid => {
      if(valid)
          this.tgService.enableMainButton()        
      else 
        this.tgService.disableMainButton()    
    })      
  }

  ngOnDestroy(): void {
    if(this.validSub)
      this.validSub.unsubscribe()

    if(this.contactSub)
      this.contactSub.unsubscribe()

    this.tgService.mainButton.offClick(this.submitCallback)
  }

  submitCallback = () => this.submit()

  submit(): void {
    let orderItemsRequest: OrderItemsRequest[] = []

    this.cartService.getOrderItems().forEach(i => {
      orderItemsRequest.push({
        productId: i.product.id,
        quantity: i.quantity
      })
    })

    let orderRequest: OrderRequest = {
      queryId: this.tgService.webApp.initDataUnsafe.query_id,
      telegramUserId: this.tgService.webApp.initDataUnsafe.user.id,
      address: this.contacts.controls['address'].value,
      name: this.contacts.controls['name'].value,
      phone: this.contacts.controls['phone'].value,
      delivery: this.contacts.controls['delivery'].value,
      orderItems: orderItemsRequest
    }

    this.orderService.createOrder(orderRequest)
      .pipe(
        catchError(e => {
          alert(e.message)
          return throwError(() => e )
        })
      ).subscribe((response: Response) => {
        console.log(response)
        this.tgService.webApp.showPopup(
          {
            title: 'Поздравляем!!!',
            message: 'Сейчас Вам придет сообщение с платежными данными. Пожалуйста, не удаляйте чат.',
            buttons: [{type: 'ok'}]
          }, () => this.tgService.webApp.close()
        )
      })
    
  }  
}
