import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private roleKey = 'user_role';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
 private apiUrl = 'https://transporteur-backend.onrender.com/api/auth';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setSession(response);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setSession(response);
        }
      })
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    localStorage.setItem(this.roleKey, authResult.user.role);
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isSuperAdmin(): boolean {
    return this.getUserRole() === 'super_admin';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}