import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineViewerComponent } from './offline-viewer.component';

describe('OfflineViewerComponent', () => {
  let component: OfflineViewerComponent;
  let fixture: ComponentFixture<OfflineViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
