import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Menu } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside 
        class="bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20"
        [ngClass]="{'w-64': isSidebarOpen, 'w-20': !isSidebarOpen}"
      >
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <span *ngIf="isSidebarOpen" class="font-bold text-xl text-yellow-400">NOON ADMIN</span>
          <button (click)="toggleSidebar()" class="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800">
            <lucide-icon name="menu" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <nav class="flex-1 py-6 overflow-y-auto">
          <ul class="space-y-2 px-2">
            <li *ngFor="let item of menuItems">
              <a 
                [routerLink]="item.path" 
                routerLinkActive="bg-yellow-400 text-slate-900 font-bold"
                class="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white group"
              >
                <lucide-icon [name]="item.icon" class="w-6 h-6"></lucide-icon>
                <span *ngIf="isSidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-4 border-t border-gray-800">
          <button class="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors" [ngClass]="{'justify-center': !isSidebarOpen}">
            <lucide-icon name="log-out" class="w-6 h-6"></lucide-icon>
            <span *ngIf="isSidebarOpen">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 transition-all duration-300" [ngClass]="{'ml-64': isSidebarOpen, 'ml-20': !isSidebarOpen}">
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  isSidebarOpen = true;

  menuItems = [
    { path: '/admin/dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
    { path: '/admin/products', icon: 'package', label: 'Products' },
    { path: '/admin/orders', icon: 'shopping-bag', label: 'Orders' },
    { path: '/admin/users', icon: 'users', label: 'Users' },
    { path: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
