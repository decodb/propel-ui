// verify-email.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { CommonModule }                 from '@angular/common';
import { AuthService } from '../../auth.service';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector:    'app-verify-email',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrls:   ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  // ── Template-bound state ───────────────────────────────────────────────────
  state:       VerifyState = 'loading';
  activeDot    = 0;
  checkDrawn   = false;
  crossDrawn   = false;

  title        = 'Verifying your email…';
  description  = 'Please wait while we confirm your email address.<br><strong>This only takes a moment.</strong>';
  badgeText    = 'Checking token';
  actionLabel  = '';

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.setError();
      return;
    }

    this.runVerification(token);
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  // ── Verification flow ──────────────────────────────────────────────────────
  private runVerification(token: string): void {
    // Step 1: advance dot to "validating"
    this.after(900, () => {
      if (this.state === 'loading') {
        this.activeDot = 1;
        this.badgeText = 'Validating…';
      }
    });

    this.authService.verifyEmail(token).subscribe({
      next:  () => this.setSuccess(),
      error: () => this.setError(),
    });
  }

  // ── State setters ──────────────────────────────────────────────────────────
  private setSuccess(): void {
    this.state       = 'success';
    this.activeDot   = 2;
    this.checkDrawn  = false;
    this.crossDrawn  = false;
    this.title       = 'Email verified!';
    this.description = `Your email has been confirmed. Your company registration is now
                        <strong>under review</strong> — we'll notify you within 24 hours.`;
    this.badgeText   = 'Verification successful';
    this.actionLabel = 'Continue to login';

    // Trigger the SVG draw animation on the next tick
    this.after(100, () => (this.checkDrawn = true));
  }

  private setError(): void {
    this.state       = 'error';
    this.activeDot   = 1;
    this.checkDrawn  = false;
    this.crossDrawn  = false;
    this.title       = 'Link expired';
    this.description = `This verification link is no longer valid. It may have already
                        been used or has <strong>expired after 24 hours</strong>.`;
    this.badgeText   = 'Token invalid or expired';
    this.actionLabel = 'Resend verification email';

    this.after(100, () => (this.crossDrawn = true));
  }

  // ── Action button handler ──────────────────────────────────────────────────
  handleAction(): void {
    if (this.state === 'success') {
      this.router.navigate(['/login']);
    } else if (this.state === 'error') {
      this.router.navigate(['/resend-verification']);
    }
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  private after(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }
}