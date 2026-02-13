import { Injectable } from '@angular/core';
import { DmSoGcsRepository } from '../repositories/dm-sogcs.repository';
import { CusLocationRepository } from '../repositories/cuslocation.repository';
import { GcsChisoRepository } from '../repositories/gcs-chiso.repository';
import { HDGVitriDdoRepository } from '../repositories/hdg-vitri-ddo.repository';
import { HDGVitriTramRepository } from '../repositories/hdg-vitri-tram.repository';
import { DTramRepository } from '../repositories/d-tram.repository';

/**
 * Service dùng để lưu dữ liệu từ API server xuống IndexedDB (offline).
 * Gọi service này sau khi tải dữ liệu từ backend về.
 */
@Injectable({ providedIn: 'root' })
export class SyncOfflineService {

  constructor(
    private dmSogcsRepo: DmSoGcsRepository,
    private cusLocationRepo: CusLocationRepository,
    private gcsChisoRepo: GcsChisoRepository,
    private vitriDdoRepo: HDGVitriDdoRepository,
    private vitriTramRepo: HDGVitriTramRepository,
    private dTramRepo: DTramRepository
  ) {}

  /**
   * Lưu tất cả dữ liệu offline 1 lần.
   * data: {
   *   dm_sogcs: any[],
   *   cuslocation: any[],
   *   gcs_chiso: any[],
   *   hdg_vitri_ddo: any[],
   *   d_tram: any[]
   * }
   */
  async saveAll(data: {
    dm_sogcs: any[];
    cuslocation: any[];
    gcs_chiso: any[];
    hdg_vitri_ddo: any[];
    hdg_vitri_tram: any[];
    d_tram: any[];
  }): Promise<void> {
    await this.dmSogcsRepo.clear();
    await this.cusLocationRepo.clear();
    await this.gcsChisoRepo.clear();
    await this.vitriDdoRepo.clear();
    await this.vitriTramRepo.clear();
    await this.dTramRepo.clear();

    await this.dmSogcsRepo.saveMany(data.dm_sogcs || []);
    await this.cusLocationRepo.saveMany(data.cuslocation || []);
    await this.gcsChisoRepo.saveMany(data.gcs_chiso || []);
    await this.vitriDdoRepo.saveMany(data.hdg_vitri_ddo || []);
    await this.vitriTramRepo.saveMany(data.hdg_vitri_tram || []);
    await this.dTramRepo.saveMany(data.d_tram || []);
  }
}
