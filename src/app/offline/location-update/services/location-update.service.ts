import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TramModel, SelectedCustomer, HdgVitriDdoModel } from '../location-update.models';
import { DTramRepository } from 'src/app/data-layer/repositories/d-tram.repository';
import { HDGVitriDdoRepository } from 'src/app/data-layer/repositories/hdg-vitri-ddo.repository';

@Injectable({
  providedIn: 'root'
})
export class LocationUpdateService {

  private trams$ = new BehaviorSubject<TramModel[]>([]);
  private customers$ = new BehaviorSubject<SelectedCustomer[]>([]);
  private selectedCustomers$ = new BehaviorSubject<SelectedCustomer[]>([]);

  /** Dùng để sinh tempCluster tạm ở FE */
  private tempClusterSeed = Date.now();

  constructor(
    private dtramRepo: DTramRepository,
    private vitriRepo: HDGVitriDdoRepository
  ) {}

  // ==== TRAM ====

  async loadTramsFromOffline(): Promise<void> {
    const list = await this.dtramRepo.getAll();
    this.trams$.next(list || []);
  }

  getTrams$() {
    return this.trams$.asObservable();
  }

  // ==== CUSTOMERS BY TRAM ====

  async loadCustomersByTramFromOffline(maTram: string): Promise<void> {
    const list = await this.vitriRepo.getByMaTram(maTram);
    const mapped: SelectedCustomer[] = (list || []).map((x: any) => ({
      ...x,
      _selected: false
    }));
    this.customers$.next(mapped);
  }

  getCustomers$() {
    return this.customers$.asObservable();
  }

  /** Lấy danh sách đã chọn để qua màn hình 2 */
  getSelectedCustomers$() {
    return this.selectedCustomers$.asObservable();
  }

  /** Cập nhật flag chọn trong danh sách màn hình 1 */
  toggleSelectCustomer(item: SelectedCustomer, selected: boolean) {
    const current = this.customers$.getValue();
    const updated = current.map(c =>
      c.MA_KHANG === item.MA_KHANG && c.SO_CONGTO === item.SO_CONGTO
        ? { ...c, _selected: selected }
        : c
    );
    this.customers$.next(updated);

    const selectedList = updated.filter(x => x._selected);
    this.selectedCustomers$.next(selectedList);
  }

  /** Tạo khách hàng mới khi nhập SO_CONGTO không tồn tại */
  async createNewCustomer(
    maTram: string | null,
    soCongTo: string,
    currentUser: string
  ): Promise<SelectedCustomer> {

    // 1) Luôn luôn kiểm tra trong OFFLINE trước
    const exist = await this.vitriRepo.findBySoCongTo(soCongTo);

    if (!exist) {
      // Không có trong offline → KHÔNG tự tạo mới, vì sẽ sinh MA_KHANG sai
      alert(
        `Không tìm thấy khách hàng với số công tơ ${soCongTo} trong dữ liệu offline.\n` +
        `Vui lòng chạy "Tải KH theo trạm" ở Offline Loader cho trạm ${maTram} trước.`
      );
      throw new Error('Meter not found in offline DB');
    }

    // 2) Nếu đã có trong OFFLINE → dùng đúng bản ghi đó
    const selected: SelectedCustomer = {
      ...exist,
      _selected: true
    };

    const current = this.customers$.getValue();
    const updated = [...current, selected];
    this.customers$.next(updated);

    const selectedList = updated.filter(x => x._selected);
    this.selectedCustomers$.next(selectedList);

    return selected;
  }


  /** Thêm vào list màn hình 1 + màn hình 2 */
  private _addToList(item: SelectedCustomer) {
    const current = this.customers$.getValue();
    const updated = [...current, item];

    this.customers$.next(updated);

    const selectedList = updated.filter(x => x._selected);
    this.selectedCustomers$.next(selectedList);
  }

/** Gọi API backend để tìm KH theo SO_CONGTO */
private async _fetchCustomerFromServer(soCongTo: string): Promise<any | null> {
  try {
    // === Gọi API: con tự tạo API get-by-socongto ===
    const res = await fetch(
      `https://itthuanan.vn:8081/api/hdg_vitri_ddo/get-by-socongto/${soCongTo}`
    );

    if (!res.ok) return null;
    const json = await res.json();

    return json?.item ?? null;
  } catch (err) {
    console.error("Lỗi gọi API get-by-socongto", err);
    return null;
  }
}


  /** Sinh tempCluster mới cho nhóm tọa độ */
  generateTempCluster(): number {
    this.tempClusterSeed += 1;
    return this.tempClusterSeed;
  }
  /** Reset toàn bộ danh sách đã chọn (dùng khi quay lại Step 1) */
  resetSelection() {
    // 1) Xóa flag _selected trong danh sách khách hàng
    const current = this.customers$.getValue();
    const updated = current.map(c => ({ ...c, _selected: false }));
    this.customers$.next(updated);

    // 2) Xóa danh sách selectedCustomers để Step 2 rỗng hoàn toàn
    this.selectedCustomers$.next([]);
  }

  /** Cập nhật thông tin tọa độ + tempCluster vào danh sách đã chọn (trên FE) */
  applyLocationToSelected(lat: number, lng: number, tempCluster: number) {
    const current = this.selectedCustomers$.getValue();
    const updated = current.map(item => ({
      ...item,
      LAT: lat,
      LNG: lng,
      tempCluster,
      UPDATEDATE: new Date().toISOString()
    }));
    this.selectedCustomers$.next(updated);
  }

  /** Lưu danh sách đã chọn (có tọa độ) về IndexedDB */
  async persistSelectedToOffline(): Promise<void> {
    const list = this.selectedCustomers$.getValue();
    if (!list || list.length === 0) return;
    const plain: HdgVitriDdoModel[] = list.map(({ _selected, ...rest }) => rest);
    await this.vitriRepo.saveMany(plain);
  }
/** Tìm khách hàng theo số công tơ trong Offline DB */
async findCustomerOffline(soCongTo: string) {
  try {
    return await this.vitriRepo.findBySoCongTo(soCongTo);
  } catch (err) {
    console.error("Lỗi findCustomerOffline:", err);
    return null;
  }
}


createNewCustomerTemp(maTram: string | null, soCongTo: string, user: string): SelectedCustomer {

  const temp: SelectedCustomer = {
    MA_TRAM: maTram || '',
    SO_CONGTO: soCongTo,
    MA_KHANG: 'TEMP-' + soCongTo,
    LAT: null,
    LNG: null,
    NOTE: 'Khách hàng tạm (ngoài hiện trường)',
    UPDATEDATE: new Date().toISOString(),
    _selected: true
  };

  // Thêm vào danh sách customers
  const current = this.customers$.getValue();
  const updated = [...current, temp];
  this.customers$.next(updated);

  // Cập nhật danh sách selectedCustomers cho Step 2
  const selectedList = updated.filter(x => x._selected);
  this.selectedCustomers$.next(selectedList);

  return temp;
}


}
