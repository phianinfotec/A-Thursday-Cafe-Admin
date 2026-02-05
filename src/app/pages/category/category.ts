import { Component, OnInit, inject } from '@angular/core';
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

  categories: any[] = [];
  filteredCategories: any[] = [];
  paginatedCategories: any[] = [];
  mainCategories: any[] = [];

  searchText = '';
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  // modal flags
  showAdd = false;
  showEdit = false;
  showView = false;
  showDelete = false;

  // data holders
  newCategory: any = {};
  editCategory: any = null;
  viewCategory: any = null;
  deleteCategory: any = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadMainCategories();
  }

  // ---------------- LOAD DATA ----------------
  loadMainCategories() {
    this.mainCategoryService.getAll().subscribe((res) => {
      this.mainCategories = res?.data || [];
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data || [];
      this.applyFilter();
    });
  }

  // ---------------- SEARCH + PAGINATION ----------------
  applyFilter() {
    const term = this.searchText.toLowerCase();
    this.filteredCategories = term
      ? this.categories.filter((c) => c.category_name.toLowerCase().includes(term))
      : [...this.categories];

    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(start, start + this.pageSize);
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePagination();
  }

  // ---------------- OPEN MODALS ----------------
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

  // ---------------- CRUD ----------------
 addCategory() {
  if (!this.newCategory.name || !this.newCategory.main_category_id) return;

  const payload = {
    name: this.newCategory.name,          // 🔥 backend wants "name"
    main_category_id: this.newCategory.main_category_id
  };

  this.closeAll();
  this.categoryService.addCategory(payload)
    .subscribe(() => this.loadCategories());
}

  updateCategory() {
    this.closeAll(); // 🔥 close first

    this.categoryService
      .updateCategory(this.editCategory.category_id, {
        name: this.editCategory.category_name,
        main_category_id: this.editCategory.main_category_id,
      })
      .subscribe(() => this.loadCategories());
  }

  deleteCat() {
    this.closeAll(); // 🔥 close first

    this.categoryService
      .deleteCategory(this.deleteCategory.category_id)
      .subscribe(() => this.loadCategories());
  }

  // ---------------- CLOSE ALL ----------------
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
