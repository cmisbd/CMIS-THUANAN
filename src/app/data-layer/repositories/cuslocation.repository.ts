import { Injectable } from '@angular/core';
import { CusLocationStore } from '../indexeddb/cuslocation.store';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CusLocationRepository {

  constructor(private store: CusLocationStore, private httpClient: HttpClient) {}

async saveMany(all: any[]): Promise<boolean> {
  try {
    await this.store.putMany(all);
    return true;            // ✔ trả đúng kiểu boolean
  } catch (error) {
    console.error(error);
    return false;           // ✔ thất bại
  }
}


  saveOne(item: any): Promise<void> {
    return this.store.putOne(item);
  }

  getAll(): Promise<any[]> {
    return this.store.getAll();
  }

  getByCustomeId(customeId: string): Promise<any | undefined> {
    return this.store.getByKey(customeId);
  }

  delete(customeId: string): Promise<void> {
    return this.store.delete(customeId);
  }

  clear(): Promise<void> {
    return this.store.clear();
  }
async syncToServer(): Promise<boolean> {
  const all = await this.store.getAll();
  if (!all.length) return false;

  try {
    await firstValueFrom(
      this.httpClient.post<any>(
        environment.apiUrl + "/clocation/set-multi",
        all
      )
    );
    await this.store.clear();
    return true;           // ✔ thành công
  } catch (e) {
    console.error(e);
    return false;          // ✔ thất bại
  }
}




}
