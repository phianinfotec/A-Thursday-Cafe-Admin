import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActiveOrder {
  id: number;
  name: string;
  time: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  /* SUMMARY */
  todayOrders = 32;
  todayEarning = 5680;
  completedOrders = 22;
  pendingOrders = 10;

  /* LAST 5 ACTIVE ORDERS */
  activeOrders: ActiveOrder[] = [
    { id: 201, name: 'Rahul Sharma', time: '5 min ago', amount: 320, status: 'Preparing' },
    { id: 202, name: 'Neha Verma', time: '8 min ago', amount: 210, status: 'Brewing' },
    { id: 203, name: 'Amit Singh', time: '12 min ago', amount: 450, status: 'Ready' },
    { id: 204, name: 'Pooja Mehta', time: '15 min ago', amount: 280, status: 'Preparing' },
    { id: 205, name: 'Karan Patel', time: '18 min ago', amount: 390, status: 'Brewing' }
  ];

}
