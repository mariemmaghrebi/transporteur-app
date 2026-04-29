import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsGeographiquesComponent } from './points-geographiques.component';

describe('PointsGeographiquesComponent', () => {
  let component: PointsGeographiquesComponent;
  let fixture: ComponentFixture<PointsGeographiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsGeographiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsGeographiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
