import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductServiceTs } from '../../../core/services/product.service';
import { Product } from '../../../core/models/proudct.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './admin-products.html',
})
export class AdminProducts implements OnInit {
  productService = inject(ProductServiceTs);
  products = this.productService.products;

  ngOnInit() {
    this.productService.getAllProducts();
  }

  deleteProduct(id: string) {
    if(confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.productService.getAllProducts();
        },
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

    private router = inject(Router);

  createProduct() {
      this.router.navigate(['/admin/products/add']);
  }

  updateProduct(id: string) {
      this.router.navigate(['/admin/products/edit', id]);
  }
}
