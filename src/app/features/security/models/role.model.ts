export interface Role {
  roleid: number;       // chữ thường, y chang API trả về
  rolename: string;
  description?: string;
  state: number;
}
