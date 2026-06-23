export interface CompanyFilters {
  page: number;
  limit: number;
  name?: string | null;
  industry?: string | null;
  status?: string | null;
  createdFrom?: string | null;
  createdTo?: string | null;
}

export interface ProfileImage {
  url: string;
}

export type CompanyIndustry = 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | string; // tighten if you have a fixed enum
export type CompanyStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | string; // same here

export interface Company {
  id: number;
  name: string;
  slug: string;
  industry: CompanyIndustry;
  website: string;
  phone: string;
  status: CompanyStatus;
  createdAt: string;
  profileImage: ProfileImage | null;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}