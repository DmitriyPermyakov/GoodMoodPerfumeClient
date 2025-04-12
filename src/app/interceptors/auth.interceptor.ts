import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

   constructor(private auth: AuthService){      
   }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.auth.token
      

      if(token) {
        let authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
         })
         return next.handle(authReq)
      }

      return next.handle(req)
   }
}