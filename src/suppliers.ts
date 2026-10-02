export interface Supplier {
  id: string;
  name: string;
  country: string;
  categories: string[];
  kind: "Manufacturer" | "Retailer" | "Manufacturer & retailer" | "Unknown";
  url: string;
  canadaShipping: string;
  customOrders: string;
  clubOrders: string;
  checked: string;
  sourceUrl: string;
  note: string;
}
// Records are admitted after the focused supplier verification is delivered.
export const suppliers: Supplier[] = [];
