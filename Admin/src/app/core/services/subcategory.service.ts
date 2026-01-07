import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/subcategories';

  subCategories = signal<any[]>([]);
  loading = signal<boolean>(false);

  getAllSubCategories() {
    this.loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
          const data = Array.isArray(res) ? res : (res.data || res.results || []);
          this.subCategories.set(data);
      },
      error: (err) => console.error('Error fetching subcategories', err),
      complete: () => this.loading.set(false),
    });
  }

  getSubCategoryById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteSubCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createSubCategory(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateSubCategory(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
