export interface MenuItem {
  id: number;                   // ID trong DB
  parent_id?: number | null;    // PARENT_ID trong DB
  title: string;
  icon?: string;
  route?: string;
  sort_order?: number;
  children?: MenuItem[];
}
