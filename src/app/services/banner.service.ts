import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BannerService {

  // ⚠️ backend prefix already /api/banner hai
  private api = environment.API_BASE_URL + '/banner';
  private activeBannerCache: any = null;

  constructor(private http: HttpClient) {}

  /* ================= HEADER ================= */

  getActiveBanner() {
    if (this.activeBannerCache) {
      return of(this.activeBannerCache);
    }

    return this.http.get<any>(`${this.api}/active`).pipe(
      tap(res => this.activeBannerCache = res)
    );
  }

  /* ================= ADMIN ================= */

  getAllBanners() {
    return this.http.get<any[]>(this.api);
  }

  addBanner(data: FormData) {
    this.activeBannerCache = null;
    return this.http.post(this.api, data);
  }

  updateStatus(id: number, is_active: number) {
    this.activeBannerCache = null;
    return this.http.patch(
      `${this.api}/${id}/status`,
      { is_active }               // 🔥 backend expects is_active
    );
  }

  deleteBanner(id: number) {
    this.activeBannerCache = null;
    return this.http.delete(`${this.api}/${id}`);
  }
}
