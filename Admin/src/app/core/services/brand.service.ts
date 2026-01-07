import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/v1/brands';

  brands = signal<any[]>([]);
  loading = signal<boolean>(false);

  getAllBrands() {
    this.loading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
          const data = Array.isArray(res) ? res : (res.data || res.brands || []);
          this.brands.set(data);
      },
      error: (err) => console.error('Error fetching brands', err),
      complete: () => this.loading.set(false),
    });
  }

  getBrandById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteBrand(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createBrand(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateBrand(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
