import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/orders';

  orders = signal<any[]>([]); // Using any for now, ideally an Order interface
  loading = signal<boolean>(false);

  async getAllOrders() {
    this.loading.set(true);
    this.http.get<{ data: any[] }>(this.apiUrl).subscribe({ // Assuming response wrapper
      next: (res: any) => {
          // Backend might return array directly or wrapped in data/results
          // Based on typical express implementations it's often res.data or just res or res.results
          // I will check network when debugging. For now assuming typical structure or direct array.
          // Let's assume the backend returns { results: X, paginationResult: ..., data: [] } or just []
          // Checking backend output format usually needed.
          // Based on previous contexts, let's assume `res.data` or `res`.
          // I'll be defensive.
          const data = Array.isArray(res) ? res : (res.data || res.docs || []);
          this.orders.set(data);
      },
      error: (err) => console.error('Error fetching orders', err),
      complete: () => this.loading.set(false),
    });
  }

  updateOrderToDelivered(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/deliver`, {});
  }

  updateOrderToPaid(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/pay`, {});
  }
}
