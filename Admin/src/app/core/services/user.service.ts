import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/users';

  users = signal<any[]>([]);
  loading = signal<boolean>(false);

  async getAllUsers() {
    this.loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
          // Similar defensive loading
          const data = Array.isArray(res) ? res : (res.data || res.users || res.docs || []);
          this.users.set(data);
      },
      error: (err) => console.error('Error fetching users', err),
      complete: () => this.loading.set(false),
    });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
