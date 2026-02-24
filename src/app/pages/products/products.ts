import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  categories: any[] = [];

  displayedColumns: string[] = [
    'image',
    'name',
    'mainCategoryName',
    'categoryName',
    'price',
    'earnPercent',
    'redeemPercent',
    'isPopular',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  newProduct: any = {
    name: '',
    category_id: '',
    price: null,
    image: null,
    is_popular: 0,
    description: '',
  };

  editProduct: any = null;
  productToDelete: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* ================= LOAD ================= */

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res.data || res;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => {

      this.products = res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        categoryName: p.category_name,
        mainCategoryName: p.main_category_name,
        price: p.price,
        earnPercent: p.earn_beans,
        redeemPercent: p.redeem_beans,
        image: p.image,
        isPopular: p.is_popular == 1 ? 'Yes' : 'No',
        description: p.description
      }));

      this.dataSource.data = this.products;
      this.cdr.detectChanges();
    });
  }

  /* ================= SEARCH ================= */

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      Object.values(data).some(val =>
        val?.toString().toLowerCase().includes(filter)
      );

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* ================= IMAGE ================= */

  onImageChange(event: any, type: 'add' | 'edit') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'add') this.newProduct.image = file;
    else this.editProduct.image = file;
  }

  getImageUrl(image: string): string {
    if (!image) return 'assets/no-image.png';
    if (image.startsWith('http')) return image;
    return `${environment.API_URL}${image}`;
  }

  /* ================= ADD ================= */

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newProduct = {
      name: '',
      category_id: '',
      price: null,
      image: null,
      is_popular: 0,
      description: '',
    };
  }

  addProduct() {
    const fd = new FormData();
    fd.append('name', this.newProduct.name);
    fd.append('category_id', this.newProduct.category_id);
    fd.append('price', this.newProduct.price);
    fd.append('is_popular', String(this.newProduct.is_popular ?? 0));
    fd.append('description', this.newProduct.description);

    if (this.newProduct.image) {
      fd.append('image', this.newProduct.image);
    }

    this.productService.addProduct(fd).subscribe(() => {
      this.loadProducts();
      this.closeAddModal();
    });
  }

  /* ================= EDIT ================= */

  handleEditClick(id: number) {
    this.productService.getProductById(id).subscribe((res: any) => {

      const product = res.data;

      this.editProduct = {
        id: product.id,
        name: product.name,
        category_id: Number(product.category_id),
        description: product.description,
        price: product.price,
        is_popular: product.is_popular,
        image: product.image
      };

      this.showEditModal = true;
      this.cdr.detectChanges();
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editProduct = null;
  }

  updateProduct() {
    const fd = new FormData();
    fd.append('name', this.editProduct.name);
    fd.append('category_id', this.editProduct.category_id);
    fd.append('price', this.editProduct.price);
    fd.append('is_popular', String(this.editProduct.is_popular ?? 0));
    fd.append('description', this.editProduct.description);

    if (this.editProduct.image instanceof File) {
      fd.append('image', this.editProduct.image);
    }

    this.productService.updateProduct(this.editProduct.id, fd)
      .subscribe(() => {
        this.loadProducts();
        this.closeEditModal();
      });
  }

  /* ================= DELETE ================= */

  openDeleteModal(product: any) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productToDelete.id)
      .subscribe(() => {
        this.loadProducts();
        this.closeDeleteModal();
      });
  }
}