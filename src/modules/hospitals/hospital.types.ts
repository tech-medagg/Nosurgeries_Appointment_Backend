export interface Hospital {
  id: string;

  name: string;

  email: string | null;

  phone: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  pincode: string | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateHospitalInput {
  name: string;

  email?: string;

  phone?: string;

  address?: string;

  city?: string;

  state?: string;

  pincode?: string;

  isActive?: boolean;
}

export interface UpdateHospitalInput {
  name?: string;

  email?: string;

  phone?: string;

  address?: string;

  city?: string;

  state?: string;

  pincode?: string;

  isActive?: boolean;
}

export interface GetHospitalsParams {
  page: number;

  limit: number;

  search?: string;

  isActive?: boolean;

  sortBy?:
    | "name"
    | "city"
    | "createdAt";

  order?: "asc" | "desc";
}

export interface HospitalListResponse {
  hospitals: Hospital[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}