import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemVenda } from './form-item-venda';

describe('FormItemVenda', () => {
  let component: FormItemVenda;
  let fixture: ComponentFixture<FormItemVenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormItemVenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormItemVenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
