import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HardcodedAuthenticationService {
  constructor() {}

  authenticate(username: any, password: any) {
    if (username == 'mdcgmsc' && password == '2025#cgmsc') {
      sessionStorage.setItem('authenticatedUser', username);
      return true;
    }
    return false;
  }

  isUserLogedIn() {
    let user = sessionStorage.getItem('authenticatedUser');
    return !(user === null);
  }
  logout() {
    sessionStorage.removeItem('authenticatedUser');
  }
}
