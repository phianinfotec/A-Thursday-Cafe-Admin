import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/product`;

  /* ================= ADMIN ================= */

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }
  getProductById(id: number) {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
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

  /* ================= USER ================= */

  getUserProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getPopularProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/popular`);
  }
}
