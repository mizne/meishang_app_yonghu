import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeListPage } from './like-list.page';

describe('LikeListPage', () => {
  let component: LikeListPage;
  let fixture: ComponentFixture<LikeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
