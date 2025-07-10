import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthStateModel } from './auth-state.type';
import { SetProfile } from './auth.actions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    profile: null,
  },
})
@Injectable()
export class AuthState {
  // define selectors
  @Selector()
  static getProfile(state: AuthStateModel) {
    return state.profile;
  }

  // define actions
  @Action(SetProfile)
  setProfile(ctx: StateContext<AuthStateModel>, action: SetProfile) {
    ctx.patchState({
      profile: action.profile,
    });
  }
}
