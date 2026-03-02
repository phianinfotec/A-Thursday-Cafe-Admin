import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.API_BASE_URL}`;

  getAdminFeedbacks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/feedback`);
  }

  approveFeedback(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/feedback/${id}/approve`, {});
  }

  removeFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/feedback/${id}/remove`);
  }

  getApprovedFeedbacks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/feedback`);
  }
}