import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { LocationUpdateService } from '../../services/location-update.service';
import { TramModel, SelectedCustomer } from '../../location-update.models';

@Component({
  selector: 'app-location-update-main',
  templateUrl: './location-update-main.component.html',
  styleUrls: ['./location-update-main.component.scss']
})
export class LocationUpdateMainComponent implements OnInit {

  username: string = '';
  trams: TramModel[] = [];
  customers: SelectedCustomer[] = [];

  selectedTram: string | null = null;
  searchSoCongTo = '';

  loadingTram = false;
  loadingCustomers = false;

  logMessages: string[] = [];
  searchTram: string = '';
  filteredTrams: any[] = [];

@ViewChild('tramSearchInput') tramSearchInput!: any;
  constructor(
    private service: LocationUpdateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        this.username = u.username || '';
      } catch {
        this.username = '';
      }
    }    
    this.loadTrams();
    this.filteredTrams = this.trams;
    this.service.getCustomers$().subscribe(list => {
      this.customers = list;
    });
  }

  private log(msg: string) {
    this.logMessages.unshift(`${new Date().toLocaleTimeString()} - ${msg}`);
  }
  private normalizeSoCongTo(value: string): string {
    if (!value) return '';
    return value.toString().padStart(12, '0');
  }

  onTramDropdownOpen() {
    this.searchTram = '';
    this.filteredTrams = this.trams || [];

    setTimeout(() => {
      if (this.tramSearchInput) {
        this.tramSearchInput.nativeElement.focus();
      }
    }, 100);
  }

filterTram() {
  const txt = (this.searchTram || '').trim().toLowerCase();

  const result = (this.trams || []).filter(x =>
    (x.MA_TRAM || '').toLowerCase().includes(txt) ||
    (x.TEN_TRAM || '').toLowerCase().includes(txt)
  );

  // Nếu lọc ra 0 → giữ lại toàn bộ danh sách (tránh mat-select đóng popup)
  this.filteredTrams = result.length > 0 ? result : this.trams;
}


  async loadTrams() {
    this.loadingTram = true;
    this.log('Đang tải danh sách trạm từ offline...');
    await this.service.loadTramsFromOffline();
    this.service.getTrams$().subscribe(list => {
      this.trams = list;
      this.loadingTram = false;
      this.log(`Đã tải ${list.length} trạm từ offline.`);
    });
  }

  async onTramChange() {
    if (!this.selectedTram) {
      this.customers = [];
      return;
    }
    this.loadingCustomers = true;
    this.log(`Đang tải khách hàng trạm ${this.selectedTram} từ offline...`);
    await this.service.loadCustomersByTramFromOffline(this.selectedTram);
    this.loadingCustomers = false;
  }

  onToggleSelect(cus: SelectedCustomer, event: any) {
    const checked = event.target.checked;
    this.service.toggleSelectCustomer(cus, checked);
  }

  /* 
  async onSearchSoCongTo() {
    if (!this.searchSoCongTo) {
      alert('Vui lòng nhập số công tơ');
      return;
    }

    // 1. Chuẩn hóa thành 12 số
    const normalized = this.normalizeSoCongTo(this.searchSoCongTo.trim());

    // 2. Tìm trong lưới hiện tại (customers) xem đã có chưa
    const exist = (this.customers || []).find(
      c => c.SO_CONGTO === normalized
    );

    if (exist) {
      // ✅ ĐÃ CÓ TRONG LƯỚI → chỉ cần tick chọn
      this.service.toggleSelectCustomer(exist, true);
      this.log(`Đã chọn công tơ ${normalized} trong danh sách hiện có.`);
      this.searchSoCongTo = '';
      return;
    }
    // 3. CHƯA CÓ TRONG LƯỚI → gọi service để lấy từ offline / tạo mới
    try {
      const selected = await this.service.createNewCustomer(
        this.selectedTram,
        normalized,
        this.username   // biến username mình đã thêm lúc nãy
      );
      this.log(`Đã thêm mới + chọn công tơ ${normalized} từ dữ liệu offline.`);
      this.searchSoCongTo = '';
    } catch (err) {
      console.error(err);
      this.log(`Không tìm thấy công tơ ${normalized} trong dữ liệu offline.`);
    }
  }
 */

  async onSearchSoCongTo() {
  if (!this.searchSoCongTo) {
    alert('Vui lòng nhập số công tơ');
    return;
  }

  // 1. Chuẩn hóa thành 12 số
  const normalized = this.normalizeSoCongTo(this.searchSoCongTo.trim());

  // 2. Tìm trong lưới hiện tại
  const exist = (this.customers || []).find(
    c => c.SO_CONGTO === normalized
  );

  if (exist) {
    // ĐÃ CÓ TRONG LƯỚI → chỉ tick chọn
    this.service.toggleSelectCustomer(exist, true);
    this.log(`Đã chọn công tơ ${normalized} trong danh sách hiện có.`);
    this.searchSoCongTo = '';
    return;
  }

  // 3. Tìm trong offline DB trước khi tạo mới
  let offline = null;
  try {
    offline = await this.service.findCustomerOffline(normalized);
  } catch (e) {
    console.error(e);
  }

  if (!offline) {
    // ❗ KHÔNG TÌM THẤY → HỎI NGƯỜI DÙNG
    const confirmCreate = confirm(
      `Không tìm thấy công tơ ${normalized} trong dữ liệu offline.\n\n` +
      `Bạn có muốn tạo KH tạm và tiếp tục không?\n\n` +
      `OK = Tạo khách hàng tạm\n` +
      `Cancel = Nhập lại số công tơ`
    );

    if (!confirmCreate) {
      // Người dùng chọn Cancel → dừng hoàn toàn
      this.searchSoCongTo = '';  // 🧹 reset input
      return;
    }

    // Người dùng OK → tạo khách hàng tạm
    const createdTemp = this.service.createNewCustomerTemp(
      this.selectedTram,
      normalized,
      this.username
    );

    this.log(`Đã tạo KH tạm và chọn công tơ ${normalized}.`);
    this.searchSoCongTo = '';
    return;
  }

  // 4. Tồn tại trong offline → thêm bình thường
  try {
    const selected = await this.service.createNewCustomer(
      this.selectedTram,
      normalized,
      this.username
    );
    this.log(`Đã thêm mới + chọn công tơ ${normalized} từ dữ liệu offline.`);
    this.searchSoCongTo = '';
  } catch (err) {
    console.error(err);
    this.log(`Không thể thêm công tơ ${normalized}.`);
  }
}

  goToSelected() {
    //this.router.navigate(['./selected']);
    this.router.navigate(['/location-update/selected']);
  }
onSoCongToInput(event: any) {
  let val = event.target.value;

  // Chỉ giữ lại ký tự số 0–9
  val = val.replace(/[^0-9]/g, '');

  // Giới hạn tối đa 12 ký tự
  if (val.length > 12) {
    val = val.substring(0, 12);
  }

  this.searchSoCongTo = val;      // cập nhật lại ngModel
  event.target.value = val;        // cập nhật lại giao diện input
}

}
