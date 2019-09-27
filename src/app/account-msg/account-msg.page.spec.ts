import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMsgPage } from './account-msg.page';

describe('AccountMsgPage', () => {
  let component: AccountMsgPage;
  let fixture: ComponentFixture<AccountMsgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMsgPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMsgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
