import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];

  searchText = '';

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

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /* ================= LOAD DATA ================= */
 handleDeleteClick(id: number) {

  const confirmDelete = confirm("Are you sure you want to delete this product?");

  if (!confirmDelete) return;

  this.productService.deleteProduct(id).subscribe({
    next: () => {
      alert("Product deleted successfully!");
      this.loadProducts(); // 🔥 refresh table
      this.cdr.detectChanges();  
    },
    error: () => {
      alert("Delete failed!");
    }
  });
}




  testClick(p: any) {
  console.log("BUTTON WORKING =>", p);
}
loadCategories() {
  this.categoryService.getCategories().subscribe({
    next: (res: any) => {
      console.log('CATEGORY API RESPONSE:', res);

      // 🔥 IMPORTANT FIX
      this.categories = res.data || res;
    },
    error: () => console.error('Failed to load categories'),
  });
}

loadProducts() {
  this.productService.getProducts().subscribe((res: any) => {

    this.products = res.data.map((p: any) => ({
      id: p.id,
      name: p.name,

      // 🔥 IMPORTANT FIX
      category_id: p.category_id || p.category,

      categoryName: p.category_name,
      mainCategoryName: p.main_category_name,
      price: p.price,
      earnPercent: p.earn_beans,
      redeemPercent: p.redeem_beans,
      image: p.image,
      isPopular: p.is_popular == 1,
      description: p.description,
    }));

    this.filteredProducts = [...this.products];
    this.cdr.detectChanges();   // 🔥 FAST LOAD FIX
  });
}


  /* ================= SEARCH ================= */

  applyFilter() {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  trackById(_: number, item: any) {
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
      category_id: '',
      price: null,
      image: null,
      is_popular: 0,
      description: '',
    };
  }
 getImageUrl(image: string): string {
  if (!image) {
    return 'assets/no-image.png';
  }

  if (image.startsWith('http')) {
    return image;
  }

  return `${environment.API_URL}${image}`;
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
    this.cdr.detectChanges();  
  }

  /* ================= EDIT ================= */


  handleEditClick(id: number) {
    this.productService.getProductById(id).subscribe((res: any) => { 
      const product = res.data;

    this.editProduct = {
      id: product.id,
      name: product.name,
      category_id: Number(product.category_id), // 🔥 important
      description: product.description,
      price: product.price,
      is_popular: product.is_popular,
      image: product.image
    };

    console.log("EDIT PRODUCT LOADED =>", this.editProduct);

    this.showEditModal = true;
     this.cdr.detectChanges(); 
  });
}

openEditModal(product: any) {
  this.editProduct = {
    ...product,
    category_id: Number(product.category_id),
    is_popular: product.is_popular ?? (product.isPopular ? 1 : 0)
  };

  this.showEditModal = true;
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
    fd.append('is_popular', String(Number(this.editProduct.isPopular)));
    fd.append('description', this.editProduct.description);

    if (this.editProduct.image instanceof File) {
      fd.append('image', this.editProduct.image);
    }

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
