export type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  active: boolean;
  createdAt?: string;
};