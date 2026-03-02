import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent implements OnInit, AfterViewInit {

  private feedbackService = inject(FeedbackService);

  displayedColumns: string[] = [
    'name',
    'rating',
    'message',
    'created_at',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadFeedbacks() {
    this.feedbackService.getAdminFeedbacks().subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  approveFeedback(id: number) {
    this.feedbackService.approveFeedback(id).subscribe(() => {
      this.loadFeedbacks();
    });
  }

  removeFeedback(id: number) {
    this.feedbackService.removeFeedback(id).subscribe(() => {
      this.loadFeedbacks();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      Object.values(data).some(val =>
        val?.toString().toLowerCase().includes(filter)
      );

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}