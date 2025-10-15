import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaBaixo } from './alerta-baixo';

describe('AlertaBaixo', () => {
  let component: AlertaBaixo;
  let fixture: ComponentFixture<AlertaBaixo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaBaixo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaBaixo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
