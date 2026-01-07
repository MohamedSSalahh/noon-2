
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  loading = signal(false);
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      image: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.categoryId = params.get('id');
        this.loadCategory(this.categoryId!);
        this.categoryForm.get('image')?.clearValidators();
        this.categoryForm.get('image')?.updateValueAndValidity();
      }
    });
  }

  loadCategory(id: string) {
    this.loading.set(true);
    this.categoryService.getCategoryById(id).subscribe({
      next: (res: any) => {
        const category = res.data || res.category || res;
        this.categoryForm.patchValue({
          name: category.name
        });
        if (category.image) this.imagePreview = category.image;
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        // this.router.navigate(['/admin/categories']);
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.categoryForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    
    const image = this.categoryForm.get('image')?.value;
    if (image instanceof File) {
      formData.append('image', image);
    }

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error updating category');
        }
      });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error creating category');
        }
      });
    }
  }
}
