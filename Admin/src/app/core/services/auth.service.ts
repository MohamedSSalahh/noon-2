import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl + '/api/v1/auth';

  currentUser = signal<any>(null); // To store user info

  constructor() {
    console.log('AuthService initialized, API URL:', this.apiUrl);
    // Check if user is already logged in (e.g. from localStorage)
    const token = localStorage.getItem('token');
    if (token) {
        // ideally verify token or decode it. For now assuming logged in.
        // We might want to store user details in localstorage too for simple access.
        const user = localStorage.getItem('user');
        if(user) this.currentUser.set(JSON.parse(user));
    }
  }

  signup(userData: any) {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(userData: any) {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}
