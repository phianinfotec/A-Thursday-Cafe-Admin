import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MainCategoryService } from '../../services/main-category.service';

@Component({
  selector: 'app-main-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-category.html',
  styleUrls: ['./main-category.css']
})
export class MainCategoryComponent implements OnInit {

  private service = inject(MainCategoryService);
  private cdr = inject(ChangeDetectorRef);

  // 🔹 DATA
  categories: any[] = [];
  filteredCategories: any[] = [];

  // 🔹 UI STATE
  searchText = '';
  isEdit = false;
  selectedId: number | null = null;
  loading = false;

  // 🔹 FORM
  formData = {
    name: '',
    slug: '',
    earn_beans: 0,
    redeem_beans: 0
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  /* ================= LOAD ================= */

  loadCategories() {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res) => {
        // ✅ map only required fields
        this.categories = res.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          earn_beans: c.earn_beans,
          redeem_beans: c.redeem_beans
        }));

        this.filteredCategories = [...this.categories];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    });
  }

  /* ================= FILTER ================= */

  applyFilter() {
    const text = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.name.toLowerCase().includes(text)
    );
  }

  trackById(_: number, item: any) {
    return item.id;
  }

  /* ================= SUBMIT ================= */

  submit() {
    if (!this.formData.name || !this.formData.slug) {
      Swal.fire('Required', 'Name and Slug are required', 'warning');
      return;
    }

    // 🔹 UPDATE
    if (this.isEdit && this.selectedId) {
      this.service.update(this.selectedId, this.formData).subscribe({
        next: () => {
          // ✅ local update (NO reload)
          const index = this.categories.findIndex(c => c.id === this.selectedId);
          if (index > -1) {
            this.categories[index] = {
              id: this.selectedId,
              ...this.formData
            };
            this.filteredCategories = [...this.categories];
          }

          Swal.fire('Updated ☕', 'Main category updated', 'success');
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err) => this.showError(err)
      });
    }

    // 🔹 CREATE
    else {
      this.service.create(this.formData).subscribe({
        next: () => {
          // ✅ local add (NO reload)
          this.categories.unshift({
            id: Date.now(), // temporary id
            ...this.formData
          });
          this.filteredCategories = [...this.categories];

          Swal.fire('Created ☕', 'Main category added', 'success');
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err) => this.showError(err)
      });
    }
  }

  /* ================= EDIT ================= */

  edit(cat: any) {
    this.isEdit = true;
    this.selectedId = cat.id;
    this.formData = { ...cat };
  }

  /* ================= DELETE ================= */

  delete(id: number) {
    Swal.fire({
      title: 'Delete?',
      text: 'This will disable the category',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6f4e37'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            // ✅ local delete (NO reload)
            this.categories = this.categories.filter(c => c.id !== id);
            this.filteredCategories = [...this.categories];

            Swal.fire('Deleted ☕', 'Category removed', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => this.showError(err)
        });
      }
    });
  }

  /* ================= RESET ================= */

  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    this.formData = {
      name: '',
      slug: '',
      earn_beans: 0,
      redeem_beans: 0
    };
  }

  /* ================= ERROR ================= */

  showError(err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops ☕',
      text: err.error?.message || 'Something went wrong',
      confirmButtonColor: '#6f4e37'
    });
  }
}
