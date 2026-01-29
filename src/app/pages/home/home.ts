import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {

  /* ================= DEPENDENCIES ================= */
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  /* ================= LIST ================= */
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 10;

  /* ================= VIEW MODAL ================= */
  showViewModal = false;
  viewOrderData: any = null;
  viewOrderItems: any[] = [];

  /* ================= ADD ORDER MODAL ================= */
  showAddOrderModal = false;

  customerMobile = '';
  customerName = '';

  products: any[] = [];
  orderItems: any[] = [];
  showItemSection = false;

  grandTotal = 0;
  totalEarnBeans = 0;
  totalRedeemBeans = 0;

  /* ================= DELETE MODAL ================= */
  showDeleteModal = false;
  orderToDelete: any = null;

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadOrders();
  }

  trackById(_: number, item: any) {
    return item.id;
  }

  /* ================= LOAD ORDERS ================= */
  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: res => {
        this.orders = (res.data || []).map((o: any) => ({
          id: o.id,
          customerName: o.username,
          orderDate: new Date(o.created_at).toLocaleString(),
          status: o.status === 'PENDING' ? 'Pending' : 'Completed',
        }));
        this.applyFilter();
      },
      error: err => console.error('ORDERS API ERROR:', err)
    });
  }

  /* ================= ADD ORDER ================= */
  goToAddOrder() {
    this.showAddOrderModal = true;
  }

  closeAddOrderModal() {
    this.showAddOrderModal = false;
    this.resetAddOrderForm();
  }

  resetAddOrderForm() {
    this.customerMobile = '';
    this.customerName = '';
    this.orderItems = [];
    this.showItemSection = false;
    this.calculateTotals();
  }

  onMobileChange() {
    if (this.customerMobile.length < 10) {
      this.customerName = '';
      return;
    }

    this.orderService.getCustomerByMobile(this.customerMobile).subscribe({
      next: res => {
        this.customerName = res?.data?.username || 'Customer not found';
      },
      error: () => {
        this.customerName = 'Customer not found';
      }
    });
  }

  /* ================= PRODUCTS ================= */
  loadProducts() {
    if (this.products.length) return;

    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || [];
      },
      error: () => alert('Failed to load products')
    });
  }

  addItemRow() {
    this.loadProducts();
    this.showItemSection = true;

    this.orderItems.push({
      product_id: '',
      name: '',
      price: 0,
      qty: 1,
      earn_beans: 0,
      redeem_beans: 0,
      total: 0,
    });

    this.calculateTotals();
  }

  onProductSelect(item: any) {
    const product = this.products.find(p => p.id == item.product_id);
    if (!product) return;

    item.name = product.name;
    item.price = Number(product.price);
    item.earn_beans = Number(product.earn_beans);
    item.redeem_beans = Number(product.redeem_beans);

    this.updateItemTotal(item);
  }

  onQtyChange(item: any) {
    if (item.qty < 1) item.qty = 1;
    this.updateItemTotal(item);
  }

  updateItemTotal(item: any) {
    item.total = item.price * item.qty;
    this.calculateTotals();
  }

  calculateTotals() {
    this.grandTotal = 0;
    this.totalEarnBeans = 0;
    this.totalRedeemBeans = 0;

    this.orderItems.forEach(item => {
      this.grandTotal += item.total;
      this.totalEarnBeans += Math.floor((item.total * item.earn_beans) / 100);
      this.totalRedeemBeans += Math.floor((item.total * item.redeem_beans) / 100);
    });
  }

  saveOrder() {
    if (!this.customerMobile || this.orderItems.length === 0) {
      alert('Please add customer & items');
      return;
    }

    const payload = {
      mobile: this.customerMobile,
      items: this.orderItems.map(i => ({
        product_id: i.product_id,
        quantity: i.qty,
        price: i.price,
        total: i.total,
        earn_beans: i.earn_beans,
        redeem_beans: i.redeem_beans
      })),
      total_amount: this.grandTotal,
      beans_earned: this.totalEarnBeans,
      beans_deducted: this.totalRedeemBeans
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        alert('Order saved successfully');
        this.closeAddOrderModal();
        this.loadOrders();
      },
      error: () => alert('Failed to save order')
    });
  }

  /* ================= VIEW ORDER ================= */
  viewOrder(order: any) {
    this.orderService.getOrderDetails(order.id).subscribe({
      next: (res: any) => {
        if (!res.success || !res.data?.length) return;

        const first = res.data[0];

        this.viewOrderData = {
          orderId: first.order_id,
          customerName: first.username,
          mobile: first.mobile,
          status: first.status,
          date: new Date(first.created_at).toLocaleString(),
          totalAmount: first.total_amount,
          beansEarned: first.beans_earned,
          beansDeducted: first.beans_deducted
        };

        this.viewOrderItems = res.data.map((item: any, i: number) => ({
          index: i + 1,
          product: item.product_name,
          qty: item.quantity,
          price: item.final_price ?? 0,
          total: (item.final_price ?? 0) * item.quantity
        }));

        this.showViewModal = true;
      },
      error: err => console.error(err)
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewOrderData = null;
    this.viewOrderItems = [];
    this.cdr.detectChanges();
  }

  /* ================= SEARCH & PAGINATION ================= */
  applyFilter() {
    this.filteredOrders = this.orders.filter(o =>
      o.customerName.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages() {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /* ================= DELETE ================= */
  confirmDelete(order: any) {
    this.orderToDelete = order;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.orderToDelete = null;
  }

  deleteOrder() {
    if (!this.orderToDelete) return;

    this.orderService.deleteOrder(this.orderToDelete.id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== this.orderToDelete.id);
        this.applyFilter();
        this.cancelDelete();
        alert('Order deleted successfully');
      },
      error: () => alert('Failed to delete order')
    });
  }
}
