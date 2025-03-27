import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private document = inject(DOCUMENT);
  private _window;
  private _webapp;
  private _startParams;

  public get startParams() {
    return this._startParams;
  }
  public get webApp() {
    return this._webapp
  }

  public get mainButton() {
    return this._webapp.MainButton
  }

  public get backButton() {
    return this._webapp.BackButton
  }

  public disableMainButton(): void {
    this.mainButton.setParams(
      { 
        is_active: false,
        color: '#bc94cc'
    })    
  }

  public enableMainButton(): void {
    this.mainButton.setParams(
      { 
        is_active: true,
        color: '#AA60C8'
      })
  }

  constructor() { 
    this._window = this.document.defaultView;
    this._webapp = this._window.Telegram.WebApp; 
    this._startParams = this._webapp.initDataUnsafe.start_param

    this.initWebApp();
  }

  private initWebApp() {
    this._webapp.ready()
    this._webapp.setHeaderColor("#AA60C8");
    this._webapp.MainButton.setParams({
      color: "#AA60C8",
      has_shine_effect: true
    })
  }
}
