import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div *ngFor="let stat of stats" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div [class]="'p-3 rounded-full ' + stat.colorBg">
            <span [class]="stat.colorText + ' text-xl font-bold'">#</span> <!-- Placeholder for icon -->
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[300px]">
        <h3 class="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
        <div class="text-center text-gray-400 py-10">
          Loading Data...
        </div>
      </div>
       <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 min-h-[300px]">
        <h3 class="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
        <div class="text-center text-gray-400 py-10">
          Loading Data...
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  stats: any[] = [
    { title: 'Total Sales', value: 'Loading...', colorBg: 'bg-green-100', colorText: 'text-green-600' },
    { title: 'Total Orders', value: 'Loading...', colorBg: 'bg-blue-100', colorText: 'text-blue-600' },
    { title: 'Total Products', value: 'Loading...', colorBg: 'bg-orange-100', colorText: 'text-orange-600' },
    { title: 'Total Users', value: 'Loading...', colorBg: 'bg-purple-100', colorText: 'text-purple-600' },
  ];

  constructor(private adminService: import('../../../../core/services/admin.service').AdminService) {}

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = [
          { title: 'Total Sales', value: typeof data.sales === 'number' ? data.sales.toFixed(2) + ' EGP' : data.sales, colorBg: 'bg-green-100', colorText: 'text-green-600' },
          { title: 'Total Orders', value: data.ordersCount, colorBg: 'bg-blue-100', colorText: 'text-blue-600' },
          { title: 'Total Products', value: data.productsCount, colorBg: 'bg-orange-100', colorText: 'text-orange-600' },
          { title: 'Total Users', value: data.usersCount, colorBg: 'bg-purple-100', colorText: 'text-purple-600' },
        ];
      },
      error: (err) => {
        console.error('Failed to load stats', err);
        // Fallback or error state
      }
    });
  }
}
