import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService {

  private baseUrl = `${environment.API_BASE_URL}/api/main-categories`;

  constructor(private http: HttpClient) {}

  // 🔹 GET all main categories
  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // 🔹 GET single main category by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // 🔹 CREATE main category
  create(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // 🔹 UPDATE main category
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // 🔹 DELETE main category (soft delete)
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
