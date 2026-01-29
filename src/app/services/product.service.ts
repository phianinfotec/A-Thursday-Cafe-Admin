import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;        // category ID
  category_name: string;   // for display
  earn_beans: number;
  redeem_beans: number;
  image: string;
  is_popular: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/product';

  getProducts(): Observable<{ success: boolean; data: Product[] }> {
    return this.http.get<{ success: boolean; data: Product[] }>(this.apiUrl);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
