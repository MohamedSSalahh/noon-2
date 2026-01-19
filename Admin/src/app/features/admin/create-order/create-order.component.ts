import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductServiceTs } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { LucideAngularModule, Search, Plus, Trash2, ShoppingCart, User, MapPin } from 'lucide-angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './create-order.component.html'
})
export class CreateOrderComponent implements OnInit {
  private productService = inject(ProductServiceTs);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  products = this.productService.products;
  searchQuery = signal('');
  cart = signal<{product: any, quantity: number}[]>([]);
  loading = signal(false);
  isEditMode = false;
  orderId: string | null = null;

  // Form
  orderForm = this.fb.group({
    customerName: ['Walk-in Customer', Validators.required],
    placeName: ['', Validators.required], // New field for "Name of the place"
    notes: ['']
  });

  // Computed
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(p => 
      p.title.toLowerCase().includes(query) || 
      (p.barcode && p.barcode.toLowerCase().includes(query))
    );
  });

  cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  // Icons
  readonly SearchIcon = Search;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly CartIcon = ShoppingCart;
  readonly UserIcon = User;
  readonly PinIcon = MapPin;

  ngOnInit() {
    this.productService.getAllProducts();
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
       this.isEditMode = true;
       this.loadOrder(this.orderId);
    }
  }

  loadOrder(id: string) {
      this.loading.set(true);
      this.orderService.getOrderById(id).subscribe({
          next: (res: any) => {
              const order = res.data || res;
              this.orderForm.patchValue({
                  customerName: order.guestName || order.user?.name || '',
                  placeName: order.shippingAddress?.details || ''
              });

              if (order.cartItems) {
                   const items = order.cartItems.map((item: any) => ({
                       product: item.product, 
                       quantity: item.quantity
                   }));
                   this.cart.set(items);
              }
              this.loading.set(false);
          },
          error: (err) => {
              console.error(err);
              this.loading.set(false);
          }
      });
  }

  updateSearch(e: Event) {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }

  addToCart(product: any) {
    const currentCart = this.cart();
    const existing = currentCart.find(item => item.product._id === product._id);

    if (existing) {
      if (existing.quantity < product.quantity) {
        // Increment
        this.cart.set(currentCart.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      } else {
        alert('Not enough stock available!');
      }
    } else {
      if (product.quantity > 0) {
        this.cart.set([...currentCart, { product, quantity: 1 }]);
      } else {
        alert('Product is out of stock!');
      }
    }
  }

  removeFromCart(productId: string) {
    this.cart.set(this.cart().filter(item => item.product._id !== productId));
  }

  updateQuantity(productId: string, delta: number) {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex(i => i.product._id === productId);
    if (itemIndex === -1) return;

    const item = currentCart[itemIndex];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      this.removeFromCart(productId);
    } else if (newQty > item.product.quantity) {
      alert('Cannot exceed available stock!');
    } else {
      const newCart = [...currentCart];
      newCart[itemIndex] = { ...item, quantity: newQty };
      this.cart.set(newCart);
    }
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    if (this.cart().length === 0) {
      alert('Cart is empty!');
      return;
    }

    this.loading.set(true);
    const formVal = this.orderForm.value;

    const orderData = {
      cartItems: this.cart().map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price, 
        color: 'Default' 
      })),
      shippingAddress: {
        details: formVal.placeName, 
        city: 'Local',
        phone: '0000000000',
        postalCode: '00000'
      },
      user: null, 
      guestName: formVal.customerName
    };

    const request = this.isEditMode && this.orderId 
        ? this.orderService.updateOrder(this.orderId, orderData)
        : this.orderService.createOrder(orderData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        alert(this.isEditMode ? 'Order updated successfully!' : 'Order created successfully!');
        this.router.navigate(['/admin/orders']);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Operation failed. Check console.');
      }
    }); 
  }
}
