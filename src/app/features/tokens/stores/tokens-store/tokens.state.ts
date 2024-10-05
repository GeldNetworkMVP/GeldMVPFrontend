import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SetTokens, SetTokensLoading } from './tokens-data.actions';
import { TokensStateModel } from './tokens-state.type';

@State<TokensStateModel>({
  name: 'tokens',
  defaults: {
    tokens: [],
    tokensLoading: false,
  },
})
@Injectable()
export class TokensState {
  // define selectors
  @Selector()
  static getTokens(state: TokensStateModel) {
    return state.tokens;
  }

  @Selector()
  static getTokensLoading(state: TokensStateModel) {
    return state.tokensLoading;
  }

  // define actions
  @Action(SetTokens)
  setTokens(ctx: StateContext<TokensStateModel>, action: SetTokens) {
    ctx.patchState({
      tokens: action.tokens,
    });
  }

  @Action(SetTokensLoading)
  setMasterDataContainersLoading(
    ctx: StateContext<TokensStateModel>,
    action: SetTokensLoading
  ) {
    ctx.patchState({
      tokensLoading: action.loading,
    });
  }
}
