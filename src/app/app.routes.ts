import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { MainLayout } from './shared/main-layout/main-layout';
import { dashboardComponent } from './pages/dashboard/dashboard';
import { ProductsComponent } from './pages/products/products';
import { CategoryComponent } from './pages/category/category';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home';
import { MainCategoryComponent } from './pages/main-category/main-category';
import { BannerComponent } from './pages/banner/banner';

export const routes: Routes = [

  // LOGIN (PUBLIC)
  {
    path: 'login',
    component: LoginComponent
  },

  // PROTECTED AREA
  {
    path: '',
    component: MainLayout,
    canMatch: [authGuard],
    children: [
      { path: 'dashboard', component: dashboardComponent },
      { path: 'banner', component: BannerComponent },
      { path: 'orders', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'main-category', component: MainCategoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // WRONG URL
  { path: '**', redirectTo: 'dashboard' }
];
