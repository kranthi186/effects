import { withLatestFrom } from 'rxjs/operator/withLatestFrom';
import { map } from 'rxjs/operator/map';
import { filter } from 'rxjs/operator/filter';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Action, Dispatcher, State } from '@ngrx/store';
import { Injectable, Provider } from '@angular/core';


export interface StateUpdate<S> {
  state: S;
  action: Action;
}

@Injectable()
export class StateUpdates<S> extends ReplaySubject<StateUpdate<S>> {
  constructor(actions$: Dispatcher, state$: State<S>) {
    super(1);

    withLatestFrom
      .call(actions$, state$)
      .subscribe(([ action, state ]) => {
        super.next({ action, state });
      });
  }

  next(update: StateUpdate<S>) { /* noop */ }
  error(err: any) { /* noop */ }
  complete() { /* noop */ }

  whenAction(...actionTypes: string[]): Observable<StateUpdate<S>> {
    return filter.call(this,
      ({ action }: StateUpdate<S>) => actionTypes.indexOf(action.type) > -1
    );
  }
}

export const STATE_UPDATES_PROVIDER = new Provider(StateUpdates, {
  useClass: StateUpdates
});