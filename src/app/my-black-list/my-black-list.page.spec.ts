import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBlackListPage } from './my-black-list.page';

describe('MyBlackListPage', () => {
  let component: MyBlackListPage;
  let fixture: ComponentFixture<MyBlackListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBlackListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBlackListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
