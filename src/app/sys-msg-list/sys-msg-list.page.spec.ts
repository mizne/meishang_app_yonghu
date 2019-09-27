import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysMsgListPage } from './sys-msg-list.page';

describe('SysMsgListPage', () => {
  let component: SysMsgListPage;
  let fixture: ComponentFixture<SysMsgListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysMsgListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysMsgListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
