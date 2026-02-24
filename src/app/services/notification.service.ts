import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private socket: Socket;
  private API = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:5000');
    this.socket.emit('joinAdmin');
  }

  // 🔥 Real-time listener
  listen(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('adminNotification', (data) => {
        observer.next(data);
      });
    });
  }

  getAll() {
    return this.http.get<any>(`${this.API}/notifications`);
  }

  getUnreadCount() {
    return this.http.get<any>(`${this.API}/notifications/unread-count`);
  }

  markAllRead() {
    return this.http.put(`${this.API}/notifications/mark-all-read`, {});
  }
}
