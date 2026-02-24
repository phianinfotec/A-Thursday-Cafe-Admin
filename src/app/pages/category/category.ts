import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CategoryService } from '../../services/category.service';
import { MainCategoryService } from '../../services/main-category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})
export class CategoryComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private mainCategoryService = inject(MainCategoryService);
  private cdr = inject(ChangeDetectorRef);

  /* ================= DATA ================= */

  categories: any[] = [];
  filteredCategories: any[] = [];
  paginatedCategories: any[] = [];
  mainCategories: any[] = [];

  searchText = '';
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  isLoading = true;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  /* ================= MODALS ================= */

  showAdd = false;
  showEdit = false;
  showView = false;
  showDelete = false;

  newCategory: any = {};
  editCategory: any = null;
  viewCategory: any = null;
  deleteCategory: any = null;

  ngOnInit(): void {
    this.loadAllData();
  }

  /* ================= LOAD ================= */

  loadAllData() {
    this.isLoading = true;

    forkJoin({
      main: this.mainCategoryService.getAll(),
      cat: this.categoryService.getCategories()
    }).subscribe({
      next: (res: any) => {

        this.mainCategories = res.main?.data || [];

        this.categories = (res.cat || []).map((c: any) => ({
          category_id: c.category_id,
          category_name: c.category_name,
          main_category_id: c.main_category_id,
          main_category_name: c.main_category_name,
        }));

        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  /* ================= FILTER ================= */

  applyFilter() {
    const term = this.searchText.toLowerCase();

    this.filteredCategories = term
      ? this.categories.filter(c =>
          c.category_name.toLowerCase().includes(term) ||
          c.main_category_name.toLowerCase().includes(term)
        )
      : [...this.categories];

    this.sortData();
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  /* ================= SORT ================= */

sortBy(column: string) {

  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filteredCategories.sort((a, b) => {

    let valueA = a[column];
    let valueB = b[column];

    // null / undefined safe check
    valueA = valueA ? valueA.toString().toLowerCase() : '';
    valueB = valueB ? valueB.toString().toLowerCase() : '';

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  this.updatePagination();
}

  sortData() {
    if (!this.sortColumn) return;

    this.filteredCategories.sort((a, b) => {
      const valA = a[this.sortColumn]?.toLowerCase();
      const valB = b[this.sortColumn]?.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /* ================= PAGINATION ================= */

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(start, start + this.pageSize);
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePagination();
  }

  /* ================= MODAL OPEN ================= */

  openAdd() {
    this.closeAll();
    this.newCategory = {};
    this.showAdd = true;
  }

  openEdit(cat: any) {
    this.closeAll();
    this.editCategory = { ...cat };
    this.showEdit = true;
  }

  openView(cat: any) {
    this.closeAll();
    this.viewCategory = cat;
    this.showView = true;
  }

  openDelete(cat: any) {
    this.closeAll();
    this.deleteCategory = cat;
    this.showDelete = true;
  }

  /* ================= ADD ================= */

  addCategory() {
    if (!this.newCategory.name || !this.newCategory.main_category_id) return;

    const payload = {
      name: this.newCategory.name,
      main_category_id: this.newCategory.main_category_id
    };

    this.categoryService.addCategory(payload).subscribe((res: any) => {

      const mainName =
        this.mainCategories.find(m => m.id == payload.main_category_id)?.name || '';

      this.categories.unshift({
        category_id: res?.id || Date.now(),
        category_name: payload.name,
        main_category_id: payload.main_category_id,
        main_category_name: mainName
      });

      this.applyFilter();
      this.closeAll();
      this.cdr.detectChanges();
    });
  }

  /* ================= UPDATE ================= */

  updateCategory() {
    if (!this.editCategory) return;

    const payload = {
      name: this.editCategory.category_name,
      main_category_id: this.editCategory.main_category_id
    };

    this.categoryService
      .updateCategory(this.editCategory.category_id, payload)
      .subscribe(() => {

        const index = this.categories.findIndex(
          c => c.category_id === this.editCategory.category_id
        );

        if (index > -1) {
          const mainName =
            this.mainCategories.find(m => m.id == payload.main_category_id)?.name || '';

          this.categories[index] = {
            ...this.categories[index],
            category_name: payload.name,
            main_category_id: payload.main_category_id,
            main_category_name: mainName
          };
        }

        this.applyFilter();
        this.closeAll();
        this.cdr.detectChanges();
      });
  }

  /* ================= DELETE ================= */

  deleteCat() {
    if (!this.deleteCategory) return;

    this.categoryService
      .deleteCategory(this.deleteCategory.category_id)
      .subscribe(() => {

        this.categories = this.categories.filter(
          c => c.category_id !== this.deleteCategory.category_id
        );

        this.applyFilter();
        this.closeAll();
        this.cdr.detectChanges();
      });
  }

  /* ================= CLOSE ================= */

  closeAll() {
    this.showAdd = false;
    this.showEdit = false;
    this.showView = false;
    this.showDelete = false;

    this.newCategory = {};
    this.editCategory = null;
    this.viewCategory = null;
    this.deleteCategory = null;
  }
}