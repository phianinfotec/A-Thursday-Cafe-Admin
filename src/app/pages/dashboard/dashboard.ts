import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { dashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Faster rendering
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class dashboardComponent implements OnInit {

  dashboardData: any;
  selectedCustomer: any;

  displayedColumns: string[] = [
    'index',
    'username',
    'email',
    'mobile',
    'created_at',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dashboardService: dashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe((res: any) => {

      console.log("FULL RESPONSE:", res);

      this.dashboardData = res.data;

      if (this.dashboardData?.last5Customers) {

        const customers = this.dashboardData.last5Customers;

        console.log("Total Customers:", customers.length);

        this.dataSource.data = customers;

        // paginator + sort attach
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.cd.markForCheck(); // ⚡ better for OnPush
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.cd.markForCheck();
  }

  viewCustomer(id: number) {
    this.dashboardService.getCustomerDetails(id).subscribe((res: any) => {
      this.selectedCustomer = res.data;
      this.cd.markForCheck();
    });
  }

  closeModal() {
    this.selectedCustomer = null;
    this.cd.markForCheck();
  }
}