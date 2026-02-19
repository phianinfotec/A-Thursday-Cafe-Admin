import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { dashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./dashboard.css'],
})
export class dashboardComponent implements OnInit {
  dashboardData: any;
  selectedCustomer: any;

  constructor(
    private dashboardService: dashboardService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe((res: any) => {
      this.dashboardData = res.data;
      this.cd.detectChanges(); // 🔥 instant update
    });
  }

  viewCustomer(id: number) {
    this.dashboardService.getCustomerDetails(id).subscribe((res: any) => {
      this.selectedCustomer = res.data;
       this.cd.detectChanges(); // 🔥 instant update
    });
  }

  closeModal() {
  this.selectedCustomer = null;
}
}
