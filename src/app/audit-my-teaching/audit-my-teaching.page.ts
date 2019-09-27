import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-audit-my-teaching',
  templateUrl: './audit-my-teaching.page.html',
  styleUrls: ['./audit-my-teaching.page.scss'],
})
export class AuditMyTeachingPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  goToHome() {
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }

}
