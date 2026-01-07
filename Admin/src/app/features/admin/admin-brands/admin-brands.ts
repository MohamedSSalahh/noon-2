import { Component, inject, OnInit } from '@angular/core';
import { BrandService } from '../../../core/services/brand.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [],
  templateUrl: './admin-brands.html',
})
export class AdminBrands implements OnInit {
  brandService = inject(BrandService);
  router = inject(Router);
  brands = this.brandService.brands;

  ngOnInit() {
    this.brandService.getAllBrands();
  }

  createBrand() {
    this.router.navigate(['/admin/brands/add']);
  }

  updateBrand(id: string) {
    this.router.navigate(['/admin/brands/edit', id]);
  }

  deleteBrand(id: string) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.brandService.getAllBrands(); // Refresh lists
        },
        error: (err) => alert('Failed to delete brand')
      });
    }
  }
}
