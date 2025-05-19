import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosEventoComponent } from './turnos-evento.component';

describe('TurnosEventoComponent', () => {
  let component: TurnosEventoComponent;
  let fixture: ComponentFixture<TurnosEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TurnosEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
