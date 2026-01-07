import { Component, inject, OnInit } from '@angular/core';
import { SubCategoryService } from '../../../core/services/subcategory.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-subcategories',
  standalone: true,
  imports: [],
  templateUrl: './admin-subcategories.html',
})
export class AdminSubCategories implements OnInit {
  subCategoryService = inject(SubCategoryService);
  router = inject(Router);
  subCategories = this.subCategoryService.subCategories;

  ngOnInit() {
    this.subCategoryService.getAllSubCategories();
  }

  createSubCategory() {
    this.router.navigate(['/admin/subcategories/add']);
  }

  updateSubCategory(id: string) {
    this.router.navigate(['/admin/subcategories/edit', id]);
  }

  deleteSubCategory(id: string) {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.subCategoryService.deleteSubCategory(id).subscribe({
        next: () => {
          this.subCategoryService.getAllSubCategories();
        },
        error: (err) => alert('Failed to delete subcategory')
      });
    }
  }
}
