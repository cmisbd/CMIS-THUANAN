export interface TramModel {
  MA_TRAM: string;
  TEN_TRAM?: string;
}

export interface HdgVitriDdoModel {
  MA_KHANG: string | null;  // KHÔNG được ép string;
  SO_CONGTO: string;
  MA_TRAM?: string | null;
  CLUSTER?: number | null;
  LAT?: number | null;
  LNG?: number | null;
  NOTE?: string | null;
  USER?: string | null;
  CREATEDATE?: string | null;
  UPDATEDATE?: string | null;

  /** Chỉ dùng trên frontend để gom nhóm tạm */
  tempCluster?: number | null;
}

export interface SelectedCustomer extends HdgVitriDdoModel {
  /** Đã được chọn để ghi nhận tọa độ hay chưa */
  _selected?: boolean;
}
