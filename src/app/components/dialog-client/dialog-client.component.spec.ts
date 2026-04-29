import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogClientComponent } from './dialog-client.component';

describe('DialogClientComponent', () => {
  let component: DialogClientComponent;
  let fixture: ComponentFixture<DialogClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
