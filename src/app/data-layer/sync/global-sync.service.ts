import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CusLocationRepository } from '../repositories/cuslocation.repository';
import { GcsChisoRepository } from '../repositories/gcs-chiso.repository';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GlobalSyncService {

  private api = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private cusRepo: CusLocationRepository,
    private chisoRepo: GcsChisoRepository
  ) {}

  async syncAll() {
    const cus = await this.cusRepo.getAll();
    const chiso = await this.chisoRepo.getAll();

    // Sync CUSLOCATION → MySQL
    if (cus.length > 0) {
      await this.http.post(`${this.api}/clocation/set-multi`, cus).toPromise();
      await this.cusRepo.clear();
    }

    // Sync GCS_CHISO → MySQL
    if (chiso.length > 0) {
      await this.http.post(`${this.api}/gcs/sync-chiso`, chiso).toPromise();
      await this.chisoRepo.clear();
    }

    return true;
  }
}
