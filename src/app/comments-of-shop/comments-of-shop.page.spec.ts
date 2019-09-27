import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsOfShopPage } from './comments-of-shop.page';

describe('CommentsOfShopPage', () => {
  let component: CommentsOfShopPage;
  let fixture: ComponentFixture<CommentsOfShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsOfShopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsOfShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
