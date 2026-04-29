import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesVoyagesComponent } from './mes-voyages.component';

describe('MesVoyagesComponent', () => {
  let component: MesVoyagesComponent;
  let fixture: ComponentFixture<MesVoyagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesVoyagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesVoyagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
