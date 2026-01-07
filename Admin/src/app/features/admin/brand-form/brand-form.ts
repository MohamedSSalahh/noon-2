
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './brand-form.html',
})
export class BrandFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private brandService = inject(BrandService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  brandForm: FormGroup;
  isEditMode = false;
  brandId: string | null = null;
  loading = signal(false);
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      image: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.brandId = params.get('id');
        this.loadBrand(this.brandId!);
        this.brandForm.get('image')?.clearValidators();
        this.brandForm.get('image')?.updateValueAndValidity();
      }
    });
  }

  loadBrand(id: string) {
    this.loading.set(true);
    this.brandService.getBrandById(id).subscribe({
      next: (res: any) => {
        const brand = res.data || res.brand || res;
        this.brandForm.patchValue({
          name: brand.name
        });
        if (brand.image) this.imagePreview = brand.image;
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        // this.router.navigate(['/admin/brands']);
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.brandForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formData = new FormData();
    formData.append('name', this.brandForm.get('name')?.value);
    
    const image = this.brandForm.get('image')?.value;
    if (image instanceof File) {
      formData.append('image', image);
    }

    if (this.isEditMode && this.brandId) {
      this.brandService.updateBrand(this.brandId, formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/brands']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error updating brand');
        }
      });
    } else {
      this.brandService.createBrand(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/brands']);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
          alert('Error creating brand');
        }
      });
    }
  }
}
