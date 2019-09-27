import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommentsPage } from './my-comments.page';

describe('MyCommentsPage', () => {
  let component: MyCommentsPage;
  let fixture: ComponentFixture<MyCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCommentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
