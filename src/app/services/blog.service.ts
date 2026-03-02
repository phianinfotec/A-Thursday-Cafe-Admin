import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}`;

  getAdminBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/blogs`);
  }

  approveBlog(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/blogs/${id}/approve`, {});
  }

  removeBlog(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/blogs/${id}/remove`);
  }
}