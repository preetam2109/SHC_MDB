import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthenticationService {

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();
  private roleId: number | null = null;
  private roleName: any| null = null;

  constructor(private http: HttpClient) { }

  // Authentication method for AAM Consultant
  executeAuthenticationServiceAAMConsultant(emailORmob: any, password: any) {
    // const url = `https://dpdmis.in/FourthTierDpdmisAPI/api/Login/LoginDetailsAAMConsultant?emailORmob=${emailORmob}&password=${password}`;
    const url = `https://dpdmis.in/AAMAPIMR/api/Login/LoginDetailsAAMConsultant?emailORmob=${emailORmob}&password=${password}`;
    return this.http.post<any>(url, {})
      .pipe(
        map(data => {
          if (data && data.roleid && data.rolename) {
            this.setRole(data.roleid, data.rolename); // Save role
          }
          return data;
        })
      );
  }

  // General authentication method
  executeAuthenticationService(emailid: string, pwd: string) {
    
    // const url = 'https://dpdmis.in/AamApi/api/Login';
    const url = 'https://dpdmis.in/AAMAPIMR/api/Login';


    return this.http.post<any>(url, { emailid, pwd }).pipe(
      map(data => {
        if (data) {
          sessionStorage.setItem('authenticatedUser', emailid);

          // Save specific user info
          const userInfo = data.userInfo;
          
          sessionStorage.setItem('facilityId', userInfo?.facilityid ?? '');
          sessionStorage.setItem('userid', userInfo?.userid ?? '');
          sessionStorage.setItem('firstname', userInfo?.firstname ?? '');
          sessionStorage.setItem('facilityTypeId', userInfo?.facilitytypeid?.toString() || '');
          sessionStorage.setItem('warehouseId', ''); // Initialize as an empty string
          
          // Save role if available
          if (userInfo?.roleid && userInfo?.rolename) {
            this.setRole(userInfo.roleid, userInfo.rolename);
          }
        }
        return data;
      })
    );
  }

  // Set role information
  setRole(roleId: number, roleName: string) {
    this.roleId = roleId;
    this.roleName = roleName;
    localStorage.setItem('roleId', roleId.toString());
    localStorage.setItem('roleName', roleName);
  }

  // Retrieve role information
  getRole() {
    return {
      roleId: this.roleId ?? Number(localStorage.getItem('roleId')),
      roleName: this.roleName ?? localStorage.getItem('roleName')
    };
  }

  // Check if AAM Consultant is logged in
  isAAMConsultantLoggedIn(): boolean {
    const user = sessionStorage.getItem('AAMConsultant');
    return !!user && !!localStorage.getItem('roleId');
  }

  // Check if a general user is logged in
  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem('authenticatedUser');
    return !!user && !!localStorage.getItem('roleId');
  }

  // Logout and clear session and local storage
  logout() {
    sessionStorage.removeItem('authenticatedUser');
    sessionStorage.removeItem('facilityId');
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('firstname');
    sessionStorage.removeItem('facilityTypeId');
    sessionStorage.removeItem('warehouseId');

    this.roleId = null;
    this.roleName = null;
    localStorage.removeItem('roleId');
    localStorage.removeItem('roleName');
  }
}
