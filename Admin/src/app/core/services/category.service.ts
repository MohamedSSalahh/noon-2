import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/categories';

  categories = signal<any[]>([]);
  loading = signal<boolean>(false);

  getAllCategories() {
    this.loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
          const data = Array.isArray(res) ? res : (res.data || res.categories || []); 
          this.categories.set(data);
      },
      error: (err) => console.error('Error fetching categories', err),
      complete: () => this.loading.set(false),
    });
  }

  getCategoryById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createCategory(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateCategory(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
