import { inject, Injectable, signal } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Product } from '../models/proudct.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceTs {
  private http = inject(HttpClient)
  private apiUrl= environment.apiUrl;
 
products = signal<Product[]>([])
loading = signal<boolean>(false)



  async getAllProducts(params: any = {}) {
    this.loading.set(true);
    this.http.get<any>(`${this.apiUrl}/api/v1/products`, { params }).subscribe({
      next: (res) => {
        // Handle wrapped responses (e.g. { data: [...] } or { products: [...] })
        let data = Array.isArray(res) ? res : (res.data || res.products || []);
        
          // Fix Image URLs
          const apiUrl = this.apiUrl || 'http://localhost:8000';
          data = data.map((product: Product) => {
             let image = product.imageCover ? product.imageCover.trim() : '';
             if (image && !image.startsWith('http')) {
                image = `${apiUrl}/products/${image}`;
             }
             return {
               ...product,
               imageCover: image
             };
          });

        this.products.set(data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products.set([]); // Reset to empty on error to avoid template errors
      },
      complete: () => this.loading.set(false),
    });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/api/v1/products/${id}`);
  }

  createProduct(data: any) {
    return this.http.post(`${this.apiUrl}/api/v1/products`, data);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/api/v1/products/${id}`, data);
  }

  getProductById(id: string) {
    return this.http.get(`${this.apiUrl}/api/v1/products/${id}`);
  }
}
