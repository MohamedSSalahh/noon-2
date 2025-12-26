import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/product/product-list/product-list').then(m => m.ProductList)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [() => inject(AuthGuard).canActivate()],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) // Placeholder
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  }
];