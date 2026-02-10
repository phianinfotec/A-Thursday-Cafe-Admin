import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // 🔹 DATA
  categories: any[] = [];
  filteredCategories: any[] = [];
  paginatedCategories: any[] = [];
  mainCategories: any[] = [];

  // 🔹 SEARCH + PAGINATION
  searchText = '';
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  // 🔹 MODALS
  showAdd = false;
  showEdit = false;
  showView = false;
  showDelete = false;

  // 🔹 HOLDERS
  newCategory: any = {};
  editCategory: any = null;
  viewCategory: any = null;
  deleteCategory: any = null;

  ngOnInit(): void {
    this.loadMainCategories();
    this.loadCategories();
  }

  /* ================= LOAD ================= */

  loadMainCategories() {
    this.mainCategoryService.getAll().subscribe({
      next: (res) => {
        this.mainCategories = res?.data || [];
        this.cdr.detectChanges();
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        // ✅ map once (clean + fast)
        this.categories = (data || []).map((c: any) => ({
          category_id: c.category_id,
          category_name: c.category_name,
          main_category_id: c.main_category_id,
          main_category_name: c.main_category_name,
        }));

        this.applyFilter();
        this.cdr.detectChanges();
      },
    });
  }

  /* ================= SEARCH + PAGINATION ================= */

  applyFilter() {
    const term = this.searchText.toLowerCase();

    this.filteredCategories = term
      ? this.categories.filter(c =>
          c.category_name.toLowerCase().includes(term)
        )
      : [...this.categories];

    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(
      start,
      start + this.pageSize
    );
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePagination();
  }

  trackById(_: number, item: any) {
    return item.category_id;
  }

  /* ================= OPEN MODALS ================= */

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

  /* ================= CREATE ================= */

  addCategory() {
    if (!this.newCategory.name || !this.newCategory.main_category_id) return;

    const payload = {
      name: this.newCategory.name,
      main_category_id: this.newCategory.main_category_id,
    };

    this.categoryService.addCategory(payload).subscribe(() => {
      // ✅ local add (NO reload)
      this.categories.unshift({
        category_id: Date.now(), // temp
        category_name: payload.name,
        main_category_id: payload.main_category_id,
        main_category_name:
          this.mainCategories.find(
            m => m.id === payload.main_category_id
          )?.name || '',
      });

      this.applyFilter();
      this.closeAll();
      this.cdr.detectChanges();
    });
  }

  /* ================= UPDATE ================= */

  updateCategory() {
    const payload = {
      name: this.editCategory.category_name,
      main_category_id: this.editCategory.main_category_id,
    };

    this.categoryService
      .updateCategory(this.editCategory.category_id, payload)
      .subscribe(() => {
        // ✅ local update
        const i = this.categories.findIndex(
          c => c.category_id === this.editCategory.category_id
        );

        if (i > -1) {
          this.categories[i] = {
            ...this.categories[i],
            ...payload,
            main_category_name:
              this.mainCategories.find(
                m => m.id === payload.main_category_id
              )?.name || '',
          };
        }

        this.applyFilter();
        this.closeAll();
        this.cdr.detectChanges();
      });
  }

  /* ================= DELETE ================= */

  deleteCat() {
    this.categoryService
      .deleteCategory(this.deleteCategory.category_id)
      .subscribe(() => {
        // ✅ local delete
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
