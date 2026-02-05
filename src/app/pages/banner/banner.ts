import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class BannerComponent implements OnInit {

  baseUrl = environment.API_URL;
  img_url = environment.API_BASE_URL

  banners: any[] = [];

  // modal
  showModal = false;
  viewMode = false;

  // form
  title = '';
  startTime = '';
  endTime = '';
  image!: File;
  preview: string | null = null;
  isActive = 1;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  /* ========== LOAD LIST ========== */
  loadBanners() {
    this.bannerService.getAllBanners().subscribe({
      next: res => this.banners = res,
      error: err => console.error(err)
    });
  }

  /* ========== ADD ========== */
  openAddModal() {
    this.resetForm();
    this.viewMode = false;
    this.showModal = true;
  }

  /* ========== VIEW ========== */
  viewBanner(banner: any) {
    this.title = banner.title;
    this.startTime = banner.start_time;
    this.endTime = banner.end_time;
    this.preview = this.baseUrl + banner.image_url;
    this.isActive = banner.is_active;

    this.viewMode = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.viewMode = false;
  }

  /* ========== IMAGE PREVIEW ========== */
  onFileChange(event: any) {
    this.image = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(this.image);
  }
submitBanner() {
  const fd = new FormData();
  fd.append('title', this.title);
  fd.append('start_time', this.startTime);
  fd.append('end_time', this.endTime);
  fd.append('image', this.image);
  fd.append('is_active', this.isActive.toString());

  this.bannerService.addBanner(fd).subscribe({
    next: () => {
      // ✅ modal band karo
      this.showModal = false;
      this.viewMode = false;

      // ✅ form reset
      this.resetForm();

      // ✅ list reload
      this.loadBanners();
    },
    error: (err) => {
      console.error('Add banner failed', err);
      alert('Banner add failed');
    }
  });
}

  // /* ========== CREATE ========== */
  // submitBanner() {
  //   const fd = new FormData();
  //   fd.append('title', this.title);
  //   fd.append('start_time', this.startTime);
  //   fd.append('end_time', this.endTime);
  //   fd.append('image', this.image);
  //   fd.append('is_active', this.isActive.toString());

  //   this.bannerService.addBanner(fd).subscribe(() => {
  //     this.closeModal();     // modal close
  //     this.resetForm();      // clear form
  //     this.loadBanners();    // refresh list
  //   });
  // }

  /* ========== STATUS ========== */
  toggleStatus(banner: any) {
    const newStatus = banner.is_active ? 0 : 1;
    banner.is_active = newStatus; // optimistic UI

    this.bannerService
      .updateStatus(banner.id, newStatus)
      .subscribe();
  }

  /* ========== DELETE ========== */
  deleteBanner(id: number, index: number) {
    if (!confirm('Are you sure to delete this banner?')) return;

    // fast UI
    this.banners.splice(index, 1);

    this.bannerService.deleteBanner(id).subscribe();
  }

  resetForm() {
    this.title = '';
    this.startTime = '';
    this.endTime = '';
    this.preview = null;
    this.isActive = 1;
  }
}
