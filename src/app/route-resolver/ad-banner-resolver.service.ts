import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take, map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AdBannerResolverService implements Resolve<string> {
  constructor(private http: HttpClient, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Observable<never> {
    return this.queryAdPicture();
  }

  queryAdPicture(): Observable<string> {
    const courseData = {
      userId: null,
      tenantId: 'sys',
      params: {
        condition: {
          ExhibitionId: '5d134a9888df65ca9a700569',
          Type: '4'
        }
      }
    };
    return this.http.post(AppComponent.apiUrl + 'v2/data/queryList/ExhibitionBanner', courseData)
      .pipe(
        map(res => {
          if ((res as any).resCode === 0) {
            return (res as any).result[0].Name;
          } else {
            return 'default banner';
          }
        })
      );
  }
}
