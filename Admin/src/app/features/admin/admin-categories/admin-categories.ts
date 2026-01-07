import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [],
  templateUrl: './admin-categories.html',
})
export class AdminCategories implements OnInit {
  categoryService = inject(CategoryService);
  router = inject(Router);
  categories = this.categoryService.categories;

  ngOnInit() {
    this.categoryService.getAllCategories();
  }

  createCategory() {
    this.router.navigate(['/admin/categories/add']);
  }

  updateCategory(id: string) {
    this.router.navigate(['/admin/categories/edit', id]);
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categoryService.getAllCategories(); // Refresh list
        },
        error: (err) => alert('Failed to delete category')
      });
    }
  }
}
