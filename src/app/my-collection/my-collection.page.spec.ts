import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCollectionPage } from './my-collection.page';

describe('MyCollectionPage', () => {
  let component: MyCollectionPage;
  let fixture: ComponentFixture<MyCollectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCollectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
