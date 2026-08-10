export interface Department {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  icon: string | null;

  displayOrder: string | null;

  isActive: string;

  metaTitle: string | null;

  metaDescription: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface GetDepartmentsParams {
  page: number;

  limit: number;

  search?: string;

  isActive?: "true" | "false";

  sortBy?:
    | "name"
    | "displayOrder"
    | "createdAt";

  order?: "asc" | "desc";
}

export interface DepartmentListResponse {
  departments: Department[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}