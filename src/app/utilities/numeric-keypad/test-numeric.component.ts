import { Component } from '@angular/core';

@Component({
  selector: 'app-test-numeric',
  templateUrl: './test-numeric.component.html',
  styleUrls: ['./test-numeric.component.css']
})
export class TestNumericComponent {

  value: string = '';

  onInput(event: any) {
    // Chỉ giữ lại các ký tự số 0-9
    const clean = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = clean;
    this.value = clean;
  }
}
