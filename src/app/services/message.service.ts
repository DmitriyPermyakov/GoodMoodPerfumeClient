import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject: BehaviorSubject<{ isSuccess: boolean, message: string }> = new BehaviorSubject({ isSuccess: false, message: ''})
  public message$ = this.messageSubject.asObservable()

  constructor() { }

  public showMessage(isSuccess: boolean, message: string): void {    
    this.messageSubject.next({ isSuccess, message: message });    
  }
  
  clearMessage(): void {
    this.messageSubject.next({ isSuccess: false, message: '' })
  }
}
