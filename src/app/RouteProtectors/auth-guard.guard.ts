import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.authService.getUser().userId.length) {
      return true;
    }

    if (await this.authService.getAutoLogin()) {
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }
}
