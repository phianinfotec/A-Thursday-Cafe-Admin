import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/order';
  private API = 'http://localhost:5000/api';

  getCustomerByMobile(mobile: string) {
    return this.http.get<any>(`${this.apiUrl}/customer/${mobile}`);
  }

  createOrder(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/add_orders`, payload);
  }
 
  getOrderById(id: number) {
  return this.http.get<any>(`${this.apiUrl}/orders/${id}`);
}
// getOrderDetails(id: number) {
//   return this.http.get<{
//     success: boolean;
//     data: {
//       order: any;
//       items: any[];
//     };
//   }>(`${this.apiUrl}/ordersDetails/${id}`);
// }
getOrderDetails(id: number) {
  return this.http.get<{ success: boolean; data: any }>(
    `http://localhost:5000/api/order/ordersDetails/${id}`
  );
}

  getProducts() {
    return this.http.get<any>(`${this.API}/product`);
  }
  getOrders() {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/orders`);
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }
}
