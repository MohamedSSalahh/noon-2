import { Component, EventEmitter, inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductServiceTs } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { LucideAngularModule, X, Save, Box, Barcode, DollarSign, AlertCircle } from 'lucide-angular';
import { Product } from '../../../core/models/proudct.model';

@Component({
  selector: 'app-product-inventory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './product-inventory-form.component.html'
})
export class ProductInventoryFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductServiceTs);
  private categoryService = inject(CategoryService);

  form!: FormGroup;
  loading = false;
  submitted = false;
  categories = this.categoryService.categories;

  // Icons
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly BoxIcon = Box;
  readonly BarcodeIcon = Barcode;
  readonly DollarIcon = DollarSign;
  readonly AlertIcon = AlertCircle;

  ngOnInit() {
    this.initForm();
    this.categoryService.getAllCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.form) {
      this.updateFormValues();
    }
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      barcode: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]], // Alphanumeric
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      reorderPoint: [10, [Validators.min(0)]],
      description: [''],
      imageCover: [''] // Optional for now
    });

    if (this.product) {
      this.updateFormValues();
    }
  }

  updateFormValues() {
    if (!this.product) return;
    
    this.form.patchValue({
      title: this.product.title,
      barcode: this.product.barcode || '',
      category: this.product.category?._id || this.product.category, // Handle object or ID
      price: this.product.price,
      quantity: this.product.quantity,
      reorderPoint: this.product.reorderPoint ?? 10,
      description: this.product.description,
      imageCover: this.product.imageCover
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const formVal = this.form.value;
    
    // Ensure required fields for backend
    const data = {
      ...formVal,
      description: formVal.description || 'No description provided.',
      imageCover: formVal.imageCover || 'https://placehold.co/600x400?text=Product'
    };

    const request = this.product
      ? this.productService.updateProduct(this.product._id, data)
      : this.productService.createProduct(data);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('An error occurred while saving the product.');
      }
    });
  }

  onCancel() {
    this.close.emit();
  }
}
