import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { OfflineDbService, SoGCS, KhachHangGCS, PendingUpdate } from './offline-db.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OfflineSyncService {

    private apiBase = environment.apiUrl;
    // ví dụ: https://itthuanan.vn:8081/api

    constructor(
        private http: HttpClient,
        private offlineDb: OfflineDbService,

    ) {
        window.addEventListener('online', () => {
            this.pushPendingUpdatesToServer();
        });
    }

    // =========================
    // 1) TẢI MASTER DATA VỀ OFFLINE
    // =========================
    async loadMasterDataFromServer(): Promise<void> {
        try {
            // 1.1 Lấy danh mục Sổ
            const booksData = await firstValueFrom(
                this.http.get<any[]>(`${this.apiBase}/sogcs/get`)
            );

            const mappedBooks: SoGCS[] = booksData.map(x => ({
                bookCode: x.ma_sogcs,
                ma_sogcs: x.ma_sogcs
            }));

            console.log('Mapped Books = ', mappedBooks);
            await this.offlineDb.saveBooks(mappedBooks);

            // 1.2 (tuỳ chọn) – nếu muốn preload KH tất cả sổ thì dùng API tổng
            // tạm thời mình chỉ lấy KH khi chọn sổ
        } catch (err) {
            console.error('Lỗi tải master data offline:', err);
        }
    }

    // =========================
    // 2) SỔ OFFLINE-FIRST
    // =========================
    async getBooksOfflineFirst(): Promise<SoGCS[]> {
        const offlineBooks = await this.offlineDb.getBooks();
        if (offlineBooks.length > 0) {
            console.log('Offline Books = ', offlineBooks);
            return offlineBooks;
        }

        const booksData = await firstValueFrom(
            this.http.get<any[]>(`${this.apiBase}/sogcs/get`)
        );

        const mappedBooks: SoGCS[] = booksData.map(x => ({
            bookCode: x.ma_sogcs,
            ma_sogcs: x.ma_sogcs
        }));

        await this.offlineDb.saveBooks(mappedBooks);
        return mappedBooks;
    }

    // =========================
    // 3) KHÁCH HÀNG OFFLINE-FIRST
    // =========================
    async getCustomersByBookOfflineFirst(bookCode: string): Promise<KhachHangGCS[]> {
        // 3.1 Ưu tiên lấy offline
        const offlineCustomers = await this.offlineDb.getCustomersByBook(bookCode);
        if (offlineCustomers.length > 0) {
            console.log('Offline Customers = ', offlineCustomers);
            return offlineCustomers;
        }

        // 3.2 Nếu offline trống → gọi API thật
        const customersData = await firstValueFrom(
            this.http.get<any[]>(`${this.apiBase}/location/getbyso/${bookCode}`)
        );

        const mappedCustomers: KhachHangGCS[] = customersData.map(x => ({
            customerId: x.ma_khang,
            customerCode: x.ma_khang,
            customerName: x.ten_khang,
            address: x.dia_chi,
            bookCode: bookCode,
            lat: x.lat,
            lng: x.lng,
            meterIndex: null,
            checked: false
        }));

        console.log('Mapped Customers = ', mappedCustomers);
        await this.offlineDb.saveCustomers(mappedCustomers);

        return mappedCustomers;
    }

    // =========================
    // 4) CẬP NHẬT TỌA ĐỘ OFFLINE-FIRST
    // =========================
    async updateCustomerCoordOffline(
        customer: KhachHangGCS,
        lat: number,
        lng: number,
        username: string
    ): Promise<void> {

        // 4.1 Cập nhật trong bảng customers (offline)
        await this.offlineDb.updateCustomerCoord(customer.customerId, lat, lng);

        // 4.2 Thêm vào pendingUpdates để sync sau
        /*
        const payload = {
            ma_khang: customer.customerCode,
            lat: lat,
            lng: lng,
            user: username,
            note: '',          // nếu sau này có ghi chú thì bổ sung
            bookCode: customer.bookCode
        };
*/
        const payload = {
            CUSTOMEID: customer.customerId,     // VIẾT HOA 100%
            LAT: lat.toString(),                // API yêu cầu STRING
            LNG: lng.toString(),                // API yêu cầu STRING
            USER: username,
            NOTE: ""
        };
        
        await this.offlineDb.addPendingUpdate({
            customerId: customer.customerId,
            actionType: 'update-location',
            payload: payload
        });

        console.log('Đã thêm pending update cho KH:', customer.customerCode);
    }

    // =========================
    // 5) ĐẨY CÁC PENDING UPDATES LÊN SERVER
    // =========================
    async pushPendingUpdatesToServer(): Promise<void> {
        if (!navigator.onLine) return; // không có mạng thì thôi

        const list: PendingUpdate[] = await this.offlineDb.getNotSyncedUpdates();
        if (!list.length) {
            console.log('Không có bản ghi chờ sync.');
            return;
        }

        try {
            const payloadArray = list.map(x => x.payload);

            // Gọi API set-multi hiện có của con
            const res = await firstValueFrom(
                this.http.post<{ success: boolean }>(
                    `${this.apiBase}/location/set-multi`,
                    payloadArray
                )
            );

            if (res?.success) {
                // Đánh dấu đã sync
                for (const item of list) {
                    await this.offlineDb.markUpdateSynced(item.id!);
                }

                // Xóa các bản ghi đã sync
                await this.offlineDb.deleteSyncedUpdates();

                console.log('Đã sync thành công', list.length, 'bản ghi.');
            } else {
                console.warn('API set-multi trả về không success:', res);
            }
        } catch (err) {
            console.error('Lỗi sync dữ liệu:', err);
        }
    }
}
