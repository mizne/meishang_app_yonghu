import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TabService {
    private tab1EnterSubject: Subject<void> = new Subject<void>();
    tab1EnterEvent: Observable<void> = this.tab1EnterSubject.asObservable()

    private tab2EnterSubject: Subject<void> = new Subject<void>();
    tab2EnterEvent: Observable<void> = this.tab2EnterSubject.asObservable()

    private tab3EnterSubject: Subject<void> = new Subject<void>();
    tab3EnterEvent: Observable<void> = this.tab3EnterSubject.asObservable()

    private tab4EnterSubject: Subject<void> = new Subject<void>();
    tab4EnterEvent: Observable<void> = this.tab4EnterSubject.asObservable()

    emitTabEnter(n: number) {
        console.log(`emitTabEnter: ${n}`)
        switch (n) {
            case 1:
                this.tab1EnterSubject.next()
                break;
            case 2:
                this.tab2EnterSubject.next()
                break;
            case 3:
                this.tab3EnterSubject.next()
                break;
            case 4:
                this.tab4EnterSubject.next()
                break;
            default:
                this.tab1EnterSubject.next()
                break;
        }
    }

}