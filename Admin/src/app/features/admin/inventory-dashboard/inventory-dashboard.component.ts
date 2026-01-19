import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductServiceTs } from '../../../core/services/product.service';
import { LucideAngularModule, Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './inventory-dashboard.component.html'
})
export class InventoryDashboardComponent implements OnInit {
  private productService = inject(ProductServiceTs);
  
  stats = this.productService.inventoryStats;
  lowStockProducts = this.productService.getLowStockProducts.bind(this.productService); // Getter or computed
  // Actually getLowStockProducts is a method in service that filters current signal.
  // Using a computed in component or just calling it in template (bad for perfs) or effect?
  // Service has: 
  // getLowStockProducts() { return this.products().filter(...) }
  // So I can expose a computed property here.
  
  // Better approach:
  get lowStockItems() {
    return this.productService.getLowStockProducts();
  }

  readonly PackageIcon = Package;
  readonly AlertIcon = AlertTriangle;
  readonly TrendIcon = TrendingUp;
  readonly DollarIcon = DollarSign;

  ngOnInit() {
    this.productService.getAllProducts();
  }
}
