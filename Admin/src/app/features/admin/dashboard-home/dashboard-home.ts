import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductServiceTs } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.html',
})
export class DashboardHome implements OnInit {
  private productService = inject(ProductServiceTs);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  stats = signal<any[]>([]);

  ngOnInit() {
    // We can run these in parallel
    // Ideally create specialized endpoints for stats in backend for performance
    // But for now, let's just fetch counts from get all
    this.productService.getAllProducts();
    this.orderService.getAllOrders();
    this.userService.getAllUsers();
    this.categoryService.getAllCategories();
    this.brandService.getAllBrands();
  }
  
  // Computed stats based on service signals
  constructor() {
    effect(() => {
      const productCount = this.productService.products().length;
      const orderCount = this.orderService.orders().length;
      const userCount = this.userService.users().length;
      const categoryCount = this.categoryService.categories().length;
      const brandCount = this.brandService.brands().length;
      
      const totalSales = this.orderService.orders().reduce((acc, order) => {
          const val = order.totalOrderPrice || order.totalPrice || order.total || 0;
          return acc + val;
      }, 0);

      this.stats.set([
        { label: 'Total Sales', value: `$${totalSales.toLocaleString()}`, change: '+12%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: orderCount.toString(), change: '+5%', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-blue-100 text-blue-600' },
        { label: 'Products', value: productCount.toString(), change: '+2%', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-purple-100 text-purple-600' },
        { label: 'Users', value: userCount.toString(), change: '+18%', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-orange-100 text-orange-600' },
        { label: 'Categories', value: categoryCount.toString(), change: '0%', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'bg-pink-100 text-pink-600' },
        { label: 'Brands', value: brandCount.toString(), change: '0%', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'bg-teal-100 text-teal-600' }
      ]);
    }, { allowSignalWrites: true });
  }
  
  // Actually, a simpler way without complex signals:
  // Just update the stats array when data comes in.
  // But wait, the services hold the signals.
  
  // Let's update the template to just use the numbers directly or use an effect.
  // Given I want to keep the "stats" array structure for the HTML loop (assuming it loops),
  // I will just use the hardcoded structure but bind values to function calls or use an effect to update it.
}
// Wait, I should verify dashboard-home.html first to see how it renders stats. I missed reading it.
// I will revert this thought and Read dashboard-home.html first.

