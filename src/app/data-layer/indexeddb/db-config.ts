import { DBSchema, openDB } from 'idb';
export const GCS_DB_NAME = 'gcs_offline_db';
export const GCS_DB_VERSION = 7;   // TĂNG VERSION ĐỂ TRIGGER UPGRADE

export interface GcsOfflineDB extends DBSchema {
  dm_sogcs: {
    key: string;
    value: any;
  };
  cuslocation: {
    key: string;
    value: any;
  };
  gcs_chiso: {
    key: string;
    value: any;
  };
  hdg_vitri_ddo: {
    key: [string, string];
    value: {
      MA_KHANG: string;
      SO_CONGTO: string;
      MA_TRAM?: string;
      LAT?: number;
      LNG?: number;
      NOTE?: string;
      USER?: string;
      tempCluster?: number;
      CLUSTER?: number;
      CREATEDATE?: string;
      UPDATEDATE?: string;
    };
    indexes: {
      by_ma_tram: string;
      by_tempCluster: number;
    };
  };
  hdg_vitri_tram: {
    key: [string, string];
    value: {
      MA_KHANG: string;
      SO_CONGTO: string;
      MA_TRAM?: string;
      LAT?: number;
      LNG?: number;
      NOTE?: string;
      USER?: string;
      tempCluster?: number;
      CLUSTER?: number;
      CREATEDATE?: string;
      UPDATEDATE?: string;
    };
    indexes: {
      by_ma_tram: string;
      by_tempCluster: number;
    };
  };  
  d_tram: {
    key: string;
    value: {
      MA_TRAM: string;
      TEN_TRAM?: string;
    };
  };
}


export const GCS_STORE_NAMES = {
  DM_SOGCS: 'dm_sogcs',
  CUSLOCATION: 'cuslocation',
  GCS_CHISO: 'gcs_chiso',
  HDG_VITRI_DDO: 'hdg_vitri_ddo',
  HDG_VITRI_TRAM: 'hdg_vitri_ddo',
  D_TRAM: 'd_tram'
} as const;


// ⭐ HÀM QUAN TRỌNG NHẤT
export function openGcsDb() {
  return openDB<GcsOfflineDB>(GCS_DB_NAME, GCS_DB_VERSION, {
    upgrade(db) {

      if (!db.objectStoreNames.contains('dm_sogcs')) {
        db.createObjectStore('dm_sogcs', { keyPath: 'MA_SOGCS' });
      }

      if (!db.objectStoreNames.contains('cuslocation')) {
        db.createObjectStore('cuslocation', { keyPath: 'CUSTOMEID' });
      }

      if (!db.objectStoreNames.contains('gcs_chiso')) {
        db.createObjectStore('gcs_chiso', { keyPath: 'MA_KHANG' });
      }

      if (!db.objectStoreNames.contains('hdg_vitri_ddo')) {
        const store = db.createObjectStore('hdg_vitri_ddo', {
          keyPath: ['MA_KHANG', 'SO_CONGTO']
        });
        store.createIndex('by_ma_tram', 'MA_TRAM');
        store.createIndex('by_tempCluster', 'tempCluster');
      }
      if (!db.objectStoreNames.contains('hdg_vitri_tram')) {
        const store = db.createObjectStore('hdg_vitri_tram', {
          keyPath: ['MA_KHANG', 'SO_CONGTO']
        });
        store.createIndex('by_ma_tram', 'MA_TRAM');
        store.createIndex('by_tempCluster', 'tempCluster');
      }
      if (!db.objectStoreNames.contains('d_tram')) {
        db.createObjectStore('d_tram', { keyPath: 'MA_TRAM' });
      }
    }
  });
}
