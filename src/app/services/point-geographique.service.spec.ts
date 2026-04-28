import { TestBed } from '@angular/core/testing';

import { PointGeographiqueService } from './point-geographique.service';

describe('PointGeographiqueService', () => {
  let service: PointGeographiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointGeographiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
