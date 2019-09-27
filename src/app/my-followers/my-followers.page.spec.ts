import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFollowersPage } from './my-followers.page';


describe('MyFollowersPage', () => {
  let component: MyFollowersPage;
  let fixture: ComponentFixture<MyFollowersPage>;



  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFollowersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFollowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
