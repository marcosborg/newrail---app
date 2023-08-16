import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'products/:category_id',
    loadComponent: () => import('./products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.page').then( m => m.CreatePage)
  },
  {
    path: 'order',
    loadComponent: () => import('./order/order.page').then( m => m.OrderPage)
  },
  {
    path: 'processing/:order_id',
    loadComponent: () => import('./processing/processing.page').then( m => m.ProcessingPage)
  },
];
