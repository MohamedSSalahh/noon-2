
import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductServiceTs } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { SubCategoryService } from '../../../core/services/subcategory.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductServiceTs);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private subCategoryService = inject(SubCategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = signal(false);
  
  categories = this.categoryService.categories;
  brands = this.brandService.brands;
  subCategories = signal<any[]>([]); // Filtered based on category selection

  imageCoverPreview: string | ArrayBuffer | null = null;
  imagesPreviews: (string | ArrayBuffer | null)[] = [];

  constructor() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      subcategories: [[]], // Multi-select
      imageCover: [null, Validators.required], // File
      images: [null] // File list
    });

    // React to subcategories data loading
    effect(() => {
       const allSubs = this.subCategoryService.subCategories();
       const catId = this.productForm.get('category')?.value;
       if (catId && allSubs.length > 0) {
           this.loadSubCategories(catId);
       }
    });
  }

  ngOnInit() {
    this.categoryService.getAllCategories();
    this.brandService.getAllBrands();
    this.subCategoryService.getAllSubCategories();

    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.isEditMode = true;
        this.productId = params.get('id');
        this.loadProduct(this.productId!);
         this.productForm.get('imageCover')?.clearValidators(); 
         this.productForm.get('imageCover')?.updateValueAndValidity();
      }
    });

    // Listen to category changes to filter subcategories
     this.productForm.get('category')?.valueChanges.subscribe(categoryId => {
        this.loadSubCategories(categoryId);
     });
  }

  loadSubCategories(categoryId: string) {
     if (!categoryId) return;
     const allSubs = this.subCategoryService.subCategories();
     const filtered = allSubs.filter((sub: any) => sub.category === categoryId || sub.category?._id === categoryId);
     this.subCategories.set(filtered);
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        const product = res.data || res.product || res;
        
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category._id || product.category,
          brand: product.brand._id || product.brand,
          subcategories: product.subcategories?.map((s:any) => s._id || s) || [] 
        });

        // Set previews
        if (product.imageCover) this.imageCoverPreview = product.imageCover;
        if (product.images) this.imagesPreviews = product.images;

        // Trigger subcategory loading for the existing category
        const catId = product.category._id || product.category;
        if(catId) this.loadSubCategories(catId);
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        // this.router.navigate(['/admin/products']); // Redirect on error?
      }
    });
  }

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length) {
      if (field === 'imageCover') {
        const file = event.target.files[0];
        this.productForm.patchValue({ imageCover: file });
        
        const reader = new FileReader();
        reader.onload = () => this.imageCoverPreview = reader.result;
        reader.readAsDataURL(file);
      } else if (field === 'images') {
        const files = Array.from(event.target.files);
        this.productForm.patchValue({ images: files });
        
        this.imagesPreviews = [];
        files.forEach((file: any) => {
           const reader = new FileReader();
           reader.onload = () => this.imagesPreviews.push(reader.result);
           reader.readAsDataURL(file);
        });
      }
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
    }

    this.loading.set(true);
    const formData = new FormData();
    const values = this.productForm.value;

    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('quantity', values.quantity);
    formData.append('category', values.category);
    formData.append('brand', values.brand);
    
    // Subcategories
    if (values.subcategories && values.subcategories.length) {
     values.subcategories.forEach((sub: string) => formData.append('subcategories', sub));
    }
    
    if (values.imageCover instanceof File) {
        formData.append('imageCover', values.imageCover);
    }
    
    if (values.images && values.images.length) {
        (values.images as any[]).forEach((file: File) => {
            formData.append('images', file);
        });
    }

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
             this.loading.set(false);
             this.router.navigate(['/admin/products']);
        },
        error: (err) => {
             console.error(err);
             this.loading.set(false);
             alert('Error updating product');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
             this.loading.set(false);
             this.router.navigate(['/admin/products']);
        },
        error: (err) => {
             console.error(err);
             this.loading.set(false);
             alert('Error creating product');
        }
      });
    }
  }
}
