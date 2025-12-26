import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/v1'; // Base URL

  constructor(private http: HttpClient) {}

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return forkJoin({
      products: this.getAllProducts(),
      orders: this.getAllOrders(),
      users: this.getAllUsers(),
      // categories: this.getAllCategories()
    }).pipe(
      map((results: any) => {
        const totalSales = results.orders.data.reduce((acc: number, order: any) => acc + (order.totalOrderPrice || 0), 0);
        return {
          sales: totalSales,
          ordersCount: results.orders.results || results.orders.data.length,
          productsCount: results.products.results || results.products.data.length,
          usersCount: results.users.results || results.users.data.length
        };
      })
    );
  }

  getAllProducts(limit: number = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/products?limit=${limit}`);
  }

  getAllOrders(): Observable<any> {
    // Check if auth header is needed! Usually yes. For now assuming public or handling auth later.
    // In React app, token is likely stored in localStorage.
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
