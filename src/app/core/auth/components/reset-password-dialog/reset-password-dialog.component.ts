import {
  Component, Input, Output, EventEmitter,
  OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink }   from '@angular/router';
import { Router }       from '@angular/router';
import {
  trigger, transition, style, animate
} from '@angular/animations';

export type ResetDialogState =
  | 'success'
  | 'invalid_token'
  | 'server_error';

@Component({
  selector:    'app-reset-password-dialog',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './reset-password-dialog.component.html',
  styleUrls:   ['./reset-password-dialog.component.scss'],
  animations: [
    trigger('backdropIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('160ms ease', style({ opacity: 0 })),
      ]),
    ]),
    trigger('dialogIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.94) translateY(12px)' }),
        animate('280ms cubic-bezier(0.16,1,0.3,1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('180ms ease',
          style({ opacity: 0, transform: 'scale(0.96) translateY(8px)' })),
      ]),
    ]),
    trigger('stateIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms cubic-bezier(0.16,1,0.3,1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ResetPasswordDialogComponent implements OnChanges, OnDestroy {

  @Input() visible           = false;
  @Input() state: ResetDialogState = 'success';
  @Input() redirectAfter     = 5;

  @Output() closed         = new EventEmitter<void>();
  @Output() retryRequested = new EventEmitter<void>();

  drawn   = false;
  shaking = false;
  redirectCountdown = 5;

  private timers:    ReturnType<typeof setTimeout>[]  = [];
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor(
    private cd:     ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.onStateChange(this.state);
    }

    // Start countdown only when dialog becomes visible in success state
    if (changes['visible']?.currentValue === true && this.state === 'success') {
      if (this.redirectAfter > 0) this.startRedirectCountdown(this.redirectAfter);
    }

    // If dialog is closed, clear all timers
    if (changes['visible']?.currentValue === false) {
      this.clearTimers();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private onStateChange(s: ResetDialogState): void {
    this.drawn = false;
    this.clearTimers();

    switch (s) {
      case 'success':
        this.after(80, () => (this.drawn = true));
        // Only start countdown if the dialog is already visible
        if (this.redirectAfter > 0 && this.visible) {
          this.startRedirectCountdown(this.redirectAfter);
        }
        break;

      case 'invalid_token':
        this.after(80, () => (this.drawn = true));
        this.triggerShake();
        break;

      case 'server_error':
        this.triggerShake();
        break;
    }
  }

  close(): void { this.closed.emit(); }

  retry(): void {
    this.retryRequested.emit();
    this.close();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) this.close();
  }

  private startRedirectCountdown(seconds: number): void {
    this.redirectCountdown = seconds;

    const i = setInterval(() => {
      this.redirectCountdown--;
      this.cd.markForCheck();
      if (this.redirectCountdown <= 0) {
        clearInterval(i);
        this.router.navigate(['/sign-in']);
      }
    }, 1000);
    this.intervals.push(i);
  }

  private triggerShake(): void {
    this.shaking = true;
    this.after(480, () => (this.shaking = false));
  }

  private after(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clearTimers(): void {
    this.timers.forEach(t    => clearTimeout(t));
    this.intervals.forEach(i => clearInterval(i));
    this.timers    = [];
    this.intervals = [];
  }
}