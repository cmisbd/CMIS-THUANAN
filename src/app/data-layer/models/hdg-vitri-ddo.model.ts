export interface HdgVitriDdoModel {
  MA_KHANG: string | null;  // KHÔNG được ép string
  SO_CONGTO: string;        // luôn string để không mất số 0
  MA_TRAM: string | null;
  CLUSTER: number | null;
  LAT: number | null;
  LNG: number | null;
  NOTE: string | null;
  USER: string;
  CREATEDATE: string | null;
  UPDATEDATE: string | null;

  // FE dùng để gom nhóm trước khi sync
  tempCluster?: number | null;

  // FE dùng để chọn trong UI
  _selected?: boolean;
}
