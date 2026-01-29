import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MainCategoryService } from '../../services/main-category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-category',
  imports:[CommonModule,FormsModule],
  templateUrl: './main-category.html',
  styleUrls: ['./main-category.css']
})
export class MainCategoryComponent implements OnInit {

  categories: any[] = [];
  isEdit = false;
  selectedId: number | null = null;

  formData = {
    name: '',
    slug: '',
    earn_beans: 0,
    redeem_beans: 0
  };

constructor(
  private service: MainCategoryService,
  private auth: AuthService
) {}

ngOnInit(): void {
  this.loadCategories();
}
  loadCategories() {
    this.service.getAll().subscribe(res => {
      this.categories = res.data;
    });
  }

  submit() {
    if (!this.formData.name || !this.formData.slug) {
      Swal.fire('Required', 'Name and Slug are required', 'warning');
      return;
    }

    if (this.isEdit && this.selectedId) {
      this.service.update(this.selectedId, this.formData).subscribe({
        next: () => {
          Swal.fire('Updated ☕', 'Main category updated', 'success');
          this.resetForm();
          this.loadCategories();
        },
        error: err => this.showError(err)
      });
    } else {
      this.service.create(this.formData).subscribe({
        next: () => {
          Swal.fire('Created ☕', 'Main category added', 'success');
          this.resetForm();
          this.loadCategories();
        },
        error: err => this.showError(err)
      });
    }
  }

  edit(cat: any) {
    this.isEdit = true;
    this.selectedId = cat.id;
    this.formData = { ...cat };
  }

  delete(id: number) {
    Swal.fire({
      title: 'Delete?',
      text: 'This will disable the category',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6f4e37'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Deleted', 'Category removed', 'success');
          this.loadCategories();
        });
      }
    });
  }

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

  showError(err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops ☕',
      text: err.error?.message || 'Something went wrong',
      confirmButtonColor: '#6f4e37'
    });
  }
}
