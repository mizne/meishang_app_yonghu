import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDiscoverListPage } from './tab-discover-list.page';

describe('TabDiscoverListPage', () => {
  let component: TabDiscoverListPage;
  let fixture: ComponentFixture<TabDiscoverListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDiscoverListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDiscoverListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
