export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy: string;
  order: "asc" | "desc";
}