export interface ExampleItem {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ExampleListParams {
  q?: string;
  page?: number;
  limit?: number;
}
