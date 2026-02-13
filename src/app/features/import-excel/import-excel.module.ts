import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImportExcelComponent } from './import-excel.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImportExcelComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ImportExcelComponent }
    ])
  ]
})
export class ImportExcelModule {}
