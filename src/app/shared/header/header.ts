import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import {
  Router,
  RouterModule,
  NavigationEnd
} from '@angular/router';

import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnDestroy {

  isMenuOpen = false;

  notifications: any[] = [];
  unreadCount = 0;
  showDropdown = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  notificationAudio: HTMLAudioElement | null = null;

  private navSub!: Subscription;
  private notificationSub!: Subscription;

  constructor() {

    /* ===============================
       CLOSE MENU ON ROUTE CHANGE
    =============================== */
    this.navSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());

    /* ===============================
       SETUP AUDIO (Browser Only)
    =============================== */
    if (isPlatformBrowser(this.platformId)) {

      // ⚠️ Rename file to remove space
      this.notificationAudio = new Audio('assets/sounds/notification sound1.mp3');
      this.notificationAudio.load();

      // 🔓 Unlock audio after first click
      document.addEventListener(
        'click',
        () => {
          this.notificationAudio?.play()
            .then(() => {
              this.notificationAudio?.pause();
              if (this.notificationAudio) {
                this.notificationAudio.currentTime = 0;
              }
            })
            .catch(() => {});
        },
        { once: true }
      );
    }

    /* ===============================
       LOAD EXISTING NOTIFICATIONS
    =============================== */
    this.notificationService.getAll().subscribe((res: any) => {
      this.notifications = res.data || [];
      this.cdr.detectChanges();
    });

    /* ===============================
       LOAD UNREAD COUNT
    =============================== */
    this.notificationService.getUnreadCount().subscribe((res: any) => {
      this.unreadCount = res.count || 0;
      this.cdr.detectChanges();
    });

    /* ===============================
       REAL-TIME LISTENER
    =============================== */
    this.notificationSub = this.notificationService.listen()
      .subscribe((data) => {

        // 👇 Important: Run inside Angular zone
        this.zone.run(() => {

          this.notifications.unshift(data);
          this.unreadCount++;

          this.playSound();

          // 🔄 Force UI update
          this.cdr.detectChanges();
        });

      });
  }

  /* ===============================
     PLAY SOUND
  =============================== */
  playSound() {
    if (!this.notificationAudio) return;

    this.notificationAudio.currentTime = 0;

    this.notificationAudio.play()
      .catch(() => {
        console.log('Audio autoplay blocked');
      });
  }

  /* ===============================
     TOGGLE MENU
  =============================== */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /* ===============================
     TOGGLE NOTIFICATION DROPDOWN
  =============================== */
  toggleNotification() {
    this.showDropdown = !this.showDropdown;

    if (this.showDropdown) {
      this.notificationService.markAllRead().subscribe(() => {
        this.unreadCount = 0;
        this.cdr.detectChanges();
      });
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  /* ===============================
     LOGOUT
  =============================== */
  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /* ===============================
     CLEANUP
  =============================== */
  ngOnDestroy() {
    if (this.navSub) this.navSub.unsubscribe();
    if (this.notificationSub) this.notificationSub.unsubscribe();
  }
}
