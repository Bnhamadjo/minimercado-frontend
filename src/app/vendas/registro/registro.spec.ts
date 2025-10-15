import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as RegistroModule from './registro';

describe('Registro', () => {
  let component: any;
  let fixture: ComponentFixture<any>;

  beforeEach(async () => {
    const Comp: any = (RegistroModule as any).Registro || (RegistroModule as any).default || (RegistroModule as any).RegistroComponent;

    await TestBed.configureTestingModule({
      declarations: [Comp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
