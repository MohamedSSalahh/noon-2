import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductServiceTs } from '../../../core/services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  productService = inject(ProductServiceTs);
  products = this.productService.products;
  
  currentPage = signal<number>(1);
  pageSize = signal<number>(8); // Show 8 products per page

  get paginatedProducts() {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.products().slice(startIndex, startIndex + this.pageSize());
  }

  get totalPages() {
    return Math.ceil(this.products().length / this.pageSize());
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnInit() {
    this.productService.getAllProducts();
  }
}
