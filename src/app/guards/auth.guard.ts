import { inject } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuardFn: CanActivateFn = (
   route: ActivatedRouteSnapshot,
   state: RouterStateSnapshot
) => {
   let auth = inject(AuthService)
   return auth.isTokenValid();
}