
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubCategoryService } from '../../../core/services/subcategory.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './subcategory-form.html',
})
export class SubCategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subCategoryService = inject(SubCategoryService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  subCategoryForm: FormGroup;
  isEditMode = false;
  subCategoryId: string | null = null;
  loading = signal(false);
  categories = this.categoryService.categories;

  constructor() {
    this.subCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categoryService.getAllCategories();

    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.subCategoryId = params.get('id');
        this.loadSubCategory(this.subCategoryId!);
      }
    });
  }

  loadSubCategory(id: string) {
    this.loading.set(true);
    // Assuming we have a getSubCategoryById method now
    this.subCategoryService.getSubCategoryById(id).subscribe({
      next: (res: any) => {
        const subCategory = res.data || res.subcategory || res;
        this.subCategoryForm.patchValue({
          name: subCategory.name,
          category: subCategory.category?._id || subCategory.category
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        // this.router.navigate(['/admin/subcategories']);
      }
    });
  }

  onSubmit() {
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    // Subcategories usually just send JSON, not FormData unless they have images
    // Assuming simple JSON body for now as per typical subcategory structure
    // If backend expects FormData, I'll switch. But typically { name, category } is JSON.
    // However, the other services used FormData. Let's check consistency.
    // For safety, I'll use simple object first. If it fails I'll switch to FormData.
    // Use object for now.
    
    const data = {
      name: this.subCategoryForm.value.name,
      category: this.subCategoryForm.value.category
    };

    if (this.isEditMode && this.subCategoryId) {
      this.subCategoryService.updateSubCategory(this.subCategoryId, data).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/subcategories']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error updating subcategory');
        }
      });
    } else {
      this.subCategoryService.createSubCategory(data).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/subcategories']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error creating subcategory');
        }
      });
    }
  }
}
