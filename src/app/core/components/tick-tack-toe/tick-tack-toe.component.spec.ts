import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickTackToeComponent } from './tick-tack-toe.component';

describe('TickTackToeComponent', () => {
  let component: TickTackToeComponent;
  let fixture: ComponentFixture<TickTackToeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickTackToeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TickTackToeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
