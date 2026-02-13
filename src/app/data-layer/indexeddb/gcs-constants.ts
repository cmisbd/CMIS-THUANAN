// Tên database dùng cho IndexedDB
export const GCS_DB_NAME = 'GCS_OFFLINE_DB';

// Version database tăng khi thay đổi cấu trúc
export const GCS_DB_VERSION = 1;

// Tên các object store
export const GCS_STORE_NAMES = {
  CUSLOCATION: 'CUSLOCATION',
  DM_SOGCS: 'DM_SOGCS',
  GCS_CHISO: 'GCS_CHISO',
  VITRIDO: 'VITRIDO',
  TRAM: 'TRAM',
  HDG_VITRI_DDO: 'HDG_VITRI_DDO',   // ⭐ THÊM DÒNG NÀY
  HDG_VITRI_TRAM: 'HDG_VITRI_TRAM' 
};
