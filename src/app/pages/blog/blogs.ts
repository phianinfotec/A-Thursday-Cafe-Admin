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

import { BlogService } from '../../services/blog.service'
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './blogs.html',
  styleUrls: ['./blogs.css']
})
export class BlogsComponent implements OnInit, AfterViewInit {

  private blogService = inject(BlogService);

  displayedColumns: string[] = [
    'image',
    'title',
    'author',
    'content',
    'created_at',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadBlogs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBlogs() {
    this.blogService.getAdminBlogs().subscribe((res: any) => {
      this.dataSource.data = res;
    });
  }

  approveBlog(id: number) {
    this.blogService.approveBlog(id).subscribe(() => {
      this.loadBlogs();
    });
  }

  removeBlog(id: number) {
    this.blogService.removeBlog(id).subscribe(() => {
      this.loadBlogs();
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

  getImageUrl(image: string): string {
    return `${environment.API_BASE_URL}/assets/blogs/${image}`;
  }
}