import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Component
import { TestNumericComponent } from './test-numeric.component';

// Routing riêng cho module test-numeric
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TestNumericComponent
  }
];

@NgModule({
  declarations: [
    TestNumericComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TestNumericModule { }
