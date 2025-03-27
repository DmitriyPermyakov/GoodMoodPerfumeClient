import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {

  public isSuccess: boolean
  public message: string = ''

  private messageSub: Subscription

  constructor(private messageService: MessageService) {}

  public clearMessage(): void {
    this.messageService.clearMessage()
  }

  ngOnInit(): void {
    this.messageSub = this.messageService.message$.subscribe(m => {
      this.isSuccess = m.isSuccess
      this.message = m.message
    })
  }

  ngOnDestroy(): void {
    if(this.messageSub)
      this.messageSub.unsubscribe()
  }
}
