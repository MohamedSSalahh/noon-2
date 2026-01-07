import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminLayout } from './features/admin/layout/admin-layout';

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
    component: AdminLayout,
    canActivate: [() => inject(AuthGuard).canActivate()],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard-home/dashboard-home').then(m => m.DashboardHome)
      },
      {
         path: 'products',
         loadComponent: () => import('./features/admin/admin-products/admin-products').then(m => m.AdminProducts)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./features/admin/product-form/product-form').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./features/admin/product-form/product-form').then(m => m.ProductFormComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/admin-categories/admin-categories').then(m => m.AdminCategories)
      },
      {
         path: 'categories/add',
         loadComponent: () => import('./features/admin/category-form/category-form').then(m => m.CategoryFormComponent)
      },
      {
         path: 'categories/edit/:id',
         loadComponent: () => import('./features/admin/category-form/category-form').then(m => m.CategoryFormComponent)
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/admin/admin-brands/admin-brands').then(m => m.AdminBrands)
      },
      {
        path: 'brands/add',
        loadComponent: () => import('./features/admin/brand-form/brand-form').then(m => m.BrandFormComponent)
      },
      {
        path: 'brands/edit/:id',
        loadComponent: () => import('./features/admin/brand-form/brand-form').then(m => m.BrandFormComponent)
      },
      {
        path: 'subcategories',
        loadComponent: () => import('./features/admin/admin-subcategories/admin-subcategories').then(m => m.AdminSubCategories)
      },
      {
        path: 'subcategories/add',
        loadComponent: () => import('./features/admin/subcategory-form/subcategory-form').then(m => m.SubCategoryFormComponent)
      },
      {
        path: 'subcategories/edit/:id',
        loadComponent: () => import('./features/admin/subcategory-form/subcategory-form').then(m => m.SubCategoryFormComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/admin/admin-reviews/admin-reviews').then(m => m.AdminReviews)
      },
      {
         path: 'orders',
         loadComponent: () => import('./features/admin/admin-orders/admin-orders').then(m => m.AdminOrders)
      },
      {
         path: 'users',
         loadComponent: () => import('./features/admin/admin-users/admin-users').then(m => m.AdminUsers)
      }

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