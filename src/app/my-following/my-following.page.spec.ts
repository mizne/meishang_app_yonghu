import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFollowingPage } from './my-following.page';

describe('MyFollowingPage', () => {
  let component: MyFollowingPage;
  let fixture: ComponentFixture<MyFollowingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFollowingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFollowingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
