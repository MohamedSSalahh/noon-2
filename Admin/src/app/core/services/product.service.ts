import { inject, Injectable, signal } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Product } from '../models/proudct.model';
import { InventoryStats } from '../models/inventory-stats.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceTs {
  private http = inject(HttpClient)
  private apiUrl= environment.apiUrl;
 
products = signal<Product[]>([])
loading = signal<boolean>(false)
inventoryStats = signal<InventoryStats | null>(null);



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
        this.calculateInventoryStats();
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

  getLowStockProducts() {
    return this.products().filter(p => p.quantity < (p.reorderPoint || 10));
  }

  calculateInventoryStats() {
    const products = this.products();
    const stats: InventoryStats = {
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      totalItems: products.length,
      lowStockCount: products.filter(p => p.quantity < (p.reorderPoint || 10)).length,
      outOfStockCount: products.filter(p => p.quantity === 0).length
    };
    this.inventoryStats.set(stats);
  }

  getProductByBarcode(barcode: string) {
    return this.products().find(p => p.barcode === barcode);
  }

  updateStock(id: string, quantity: number) {
    return this.http.put(`${this.apiUrl}/api/v1/products/${id}`, { quantity });
  }
}
