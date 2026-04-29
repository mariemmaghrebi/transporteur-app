import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointGeographiqueDialogComponent } from './point-geographique-dialog.component';

describe('PointGeographiqueDialogComponent', () => {
  let component: PointGeographiqueDialogComponent;
  let fixture: ComponentFixture<PointGeographiqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointGeographiqueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointGeographiqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
