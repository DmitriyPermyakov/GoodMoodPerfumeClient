import { Injectable } from '@angular/core';
import { JwtPayload } from '../interfaces/app-interfaces';
import { jwtDecode } from 'jwt-decode'; 
import { TelegramService } from './telegram.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token';
  private _token

  constructor(private tgService: TelegramService) {
    this.token = this.tgService.startParams
   }

  private set token(token: string) {
    this._token = token
    localStorage.setItem('access_token', this.token)
  }

  public get token(): string {
    return localStorage.getItem('access_token')
  }

  public isTokenValid(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if(!token) return false

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch(e) {
      return false
    }
  }  
}



