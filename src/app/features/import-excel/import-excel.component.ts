import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { SoGcsService } from '../import-excel/sogcs.service';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent {

  selectedFile!: File;
  previewData: any[] = [];
  previewColumns: string[] = [];

  message = '';
  loading = false;
  progress = 0;

  constructor(private sogcsService: SoGcsService) {}

  // ============================================
  // 1) CHỌN FILE
  // ============================================
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewExcel(this.selectedFile);
  }

  // ============================================
  // 2) PREVIEW EXCEL
  // ============================================
  previewExcel(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const buffer = e.target.result;   // ArrayBuffer

      const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      if (!data || data.length === 0) return;

      this.previewColumns = data[0] as string[];

      this.previewData = [];
      for (let i = 1; i <= 5; i++) {
        if (!data[i]) break;

        const rowObj: any = {};
        this.previewColumns.forEach((col: string, idx: number) => {
          rowObj[col] = data[i][idx] ?? "";
        });

        this.previewData.push(rowObj);
      }
    };

    reader.readAsArrayBuffer(file);   // ⭐ KHÔNG deprecated
  }

  // ============================================
  // 3) UPLOAD + IMPORT
  // ============================================
  uploadExcel() {
    if (!this.selectedFile) {
      alert("Vui lòng chọn file Excel!");
      return;
    }

    this.loading = true;
    this.progress = 0;
    this.message = "";

    this.sogcsService.importExcel(this.selectedFile).subscribe(
      event => {

        // TIẾN TRÌNH UPLOAD
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(
            100 * event.loaded / (event.total || 1)
          );
        }

        // KẾT QUẢ TRẢ VỀ
        if (event.type === HttpEventType.Response) {
          const body: any = event.body;

          this.loading = false;
          this.progress = 100;

          const total = body?.inserted ?? body?.total ?? 0;

          this.message = `Import thành công: ${total} dòng`;
        }
      },
      err => {
        this.loading = false;
        this.message = "Lỗi import!";
      }
    );
  }
}
