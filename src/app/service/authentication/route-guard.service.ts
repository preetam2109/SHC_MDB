import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BasicAuthenticationService } from './basic-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    private loginService: BasicAuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.loginService.isUserLoggedIn() || this.loginService.isAAMConsultantLoggedIn();
    
    if (!isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }

    // Retrieve the user's role from the authentication service
    const userRole = this.loginService.getRole().roleName;

    // Get the allowed roles from the route data
    const allowedRoles = route.data['allowedRoles'] as string[];

    // Allow access if the user's role is included in the allowed roles
    if (!allowedRoles || allowedRoles.includes(userRole)) {
      return true;
    } else {
      // Redirect to an unauthorized page or login if role does not match
      this.router.navigate(['login']); // Adjust route as necessary
      return false;
    }
  }
}
