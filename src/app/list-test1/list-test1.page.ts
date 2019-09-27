import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-test1',
  templateUrl: './list-test1.page.html',
  styleUrls: ['./list-test1.page.scss'],
})
export class ListTest1Page implements OnInit {

  constructor() { 

    var body = document.body,
      grid = document.querySelector('.grid');

  }
  ngOnInit() {
  }

}
