import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];

  searchText = '';

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  newProduct: any = {
    name: '',
    category: '',
    price: null,
    earnBeans: null,
    redeemBeans: null,
    image: null,
    isPopular: false,
    description: '',
  };

  editProduct: any = null;
  productToDelete: any = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /* ================= GET ================= */
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        console.log('CATEGORY API RESPONSE:', res);
        this.categories = res; // ✅ DIRECT ARRAY
      },
      error: () => {
        console.error('Failed to load categories');
      },
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.data.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category, // ID
        categoryName: p.category_name, // Display
        price: p.price,
        earnBeans: p.earn_beans,
        redeemBeans: p.redeem_beans,
        image: p.image,
        isPopular: p.is_popular == 1, // ✅ IMPORTANT
        description: p.description,
      }));
      this.filteredProducts = [...this.products];
      this.cdr.detectChanges();
    });
  }

  applyFilter() {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  trackByName(_: number, item: any) {
    return item.id;
  }

  /* ================= IMAGE ================= */

  onImageChange(event: any, type: 'add' | 'edit') {
    const file = event.target.files[0];
    if (!file) return;
    if (type === 'add') this.newProduct.image = file;
    else this.editProduct.image = file;
  }

  /* ================= ADD ================= */

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newProduct = {
      name: '',
      category: '',
      price: null,
      earnBeans: null,
      redeemBeans: null,
      image: null,
      // isPopular:0
    };
  }

  addProduct() {
    const fd = new FormData();
    fd.append('name', this.newProduct.name);
    fd.append('category', this.newProduct.category); // ID save
    fd.append('price', this.newProduct.price);
    fd.append('earn_beans', this.newProduct.earnBeans);
    fd.append('redeem_beans', this.newProduct.redeemBeans);
    fd.append('is_popular', this.newProduct.isPopular ? '1' : '0'); // ✅
    fd.append('description', this.newProduct.description);
    if (this.newProduct.image) fd.append('image', this.newProduct.image);

    this.productService.addProduct(fd).subscribe(() => {
      this.loadProducts();
      this.closeAddModal();
    });
  }

  /* ================= EDIT ================= */

  openEditModal(product: any) {
    this.editProduct = { ...product };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editProduct = null;
  }

  updateProduct() {
    const fd = new FormData();
    fd.append('name', this.editProduct.name);
    fd.append('category', this.editProduct.category); // ID
    fd.append('price', this.editProduct.price);
    fd.append('earn_beans', this.editProduct.earnBeans);
    fd.append('redeem_beans', this.editProduct.redeemBeans);
   fd.append(
  'is_popular',
  String(Number(this.editProduct.isPopular))
);
    fd.append('description', this.editProduct.description);
    if (this.editProduct.image instanceof File) {
      fd.append('image', this.editProduct.image);
    }

    // ✅ DEBUG PROPERLY
    fd.forEach((value, key) => {
      console.log(key, value);
    });
    this.productService.updateProduct(this.editProduct.id, fd).subscribe(() => {
      this.loadProducts();
      this.closeEditModal();
    });
  }

  /* ================= DELETE ================= */

  confirmDelete(product: any) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
      this.loadProducts();
      this.cancelDelete();
    });
  }
}
