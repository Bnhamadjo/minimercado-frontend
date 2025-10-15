import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemItens } from './listagem-itens';

describe('ListagemItens', () => {
  let component: ListagemItens;
  let fixture: ComponentFixture<ListagemItens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemItens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemItens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
