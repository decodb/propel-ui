import {
  Component, Input, Output, EventEmitter,
  OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CommonModule }  from '@angular/common';
import {
  trigger, transition, style, animate
} from '@angular/animations';

export type DialogState =
  | 'success'
  | 'rate_limited'
  | 'server_error';

@Component({
  selector:    'app-forgot-password-dialog',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls:   ['./forgot-password-dialog.component.scss'],
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
export class ForgotPasswordDialogComponent implements OnChanges, OnDestroy {

  // ── Inputs ─────────────────────────────────────────────────────────────────
  @Input() visible            = false;
  @Input() state: DialogState = 'success';
  @Input() email              = '';
  /** Duration for rate-limit countdown (seconds). Default: 60 */
  @Input() rateLimitSeconds   = 60;

  // ── Outputs ────────────────────────────────────────────────────────────────
  @Output() closed          = new EventEmitter<void>();
  @Output() retryRequested  = new EventEmitter<void>();
  @Output() resendRequested = new EventEmitter<void>();

  // ── Internal ───────────────────────────────────────────────────────────────
  drawn   = false;
  shaking = false;
  cooldown = 0;

  rlCountdown = 60;
  rlOffset    = 0;

  private timers:    ReturnType<typeof setTimeout>[]  = [];
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) this.onStateChange(this.state);
  }

  ngOnDestroy(): void { this.clearTimers(); }

  // ── State handler ──────────────────────────────────────────────────────────
  private onStateChange(s: DialogState): void {
    this.drawn = false;
    this.clearTimers();

    switch (s) {
      case 'success':
        this.after(80, () => (this.drawn = true));
        this.startCooldown(30);
        break;

      case 'rate_limited':
        this.startRateLimitCountdown(this.rateLimitSeconds);
        break;

      case 'server_error':
        this.triggerShake();
        break;
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  close(): void { this.closed.emit(); }

  retry(): void { this.retryRequested.emit(); this.close(); }

  resend(): void {
    if (this.cooldown > 0) return;
    this.resendRequested.emit();
    this.startCooldown(30);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) this.close();
  }

  // ── Cooldown ───────────────────────────────────────────────────────────────
  private startCooldown(seconds: number): void {
    this.cooldown = seconds;
    const i = setInterval(() => {
      this.cooldown--;
      this.cd.markForCheck();
      if (this.cooldown <= 0) clearInterval(i);
    }, 1000);
    this.intervals.push(i);
  }

  // ── Rate limit countdown ───────────────────────────────────────────────────
  private startRateLimitCountdown(seconds: number): void {
    const circumference = 138.2;
    this.rlCountdown = seconds;
    this.rlOffset    = 0;

    const i = setInterval(() => {
      this.rlCountdown--;
      this.rlOffset = circumference * (1 - this.rlCountdown / seconds);
      this.cd.markForCheck();
      if (this.rlCountdown <= 0) {
        clearInterval(i);
        this.retry(); // auto-dismiss and return to form
      }
    }, 1000);
    this.intervals.push(i);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
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