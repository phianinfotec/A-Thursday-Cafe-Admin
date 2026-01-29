import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  category_id: number;
  category_name: string;
  main_category_id: number;
  main_category_name: string;
  earn_beans: number;
  redeem_beans: number;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}/api/category`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  addCategory(payload: {
    name: string;
    main_category_id: number;
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  updateCategory(id: number, payload: {
    name: string;
    main_category_id: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
