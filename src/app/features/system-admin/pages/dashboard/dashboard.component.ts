import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { SystemAdminService } from '../../system-admin.service';
import { Company, CompanyFilters, PaginatedResponse, PaginationMeta } from '../../system-admin.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  filterForm = new FormGroup({
    name: new FormControl(''),
    industry: new FormControl(''),
    status: new FormControl(''),
    createdFrom: new FormControl(''),
    createdTo: new FormControl(''),
  });

  page = 1;
  limit = 10;

  companies: Company[] = [];
  meta: PaginationMeta | null = null;
  loading = false;

  private destroy$ = new Subject<void>();
  private pageChange$ = new Subject<number>();

  constructor(private systemAdminService: SystemAdminService) {}

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(() => (this.page = 1)), // reset pagination when filters change
        switchMap(() => {
          this.loading = true;
          return this.systemAdminService.findAll(this.buildFilters());
        }),
      )
      .subscribe({
        next: (res) => this.applyResult(res),
        error: () => (this.loading = false),
      });

    // Page changes -> call immediately, no debounce
    this.pageChange$
      .pipe(
        takeUntil(this.destroy$),
        tap((p) => (this.page = p)),
        switchMap(() => {
          this.loading = true;
          return this.systemAdminService.findAll(this.buildFilters());
        }),
      )
      .subscribe({
        next: (res) => this.applyResult(res),
        error: () => (this.loading = false),
      });

    // Initial load
    this.systemAdminService.findAll(this.buildFilters())
      .subscribe({
        next: (res) => {
          this.applyResult(res)
          //console.log(res);
        }
      });
  }

  onPageChange(page: number): void {
    this.pageChange$.next(page);
  }

  private buildFilters(): CompanyFilters {
    const raw = this.filterForm.value;

    const cleaned = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== null && v !== undefined && v !== ''),
    );

    return {
      ...cleaned,
      page: this.page,
      limit: this.limit,
    } as CompanyFilters;
  }

 private applyResult(res: PaginatedResponse<Company>): void {
  this.companies = res.items;
  this.meta = res.meta;
  this.loading = false;
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
