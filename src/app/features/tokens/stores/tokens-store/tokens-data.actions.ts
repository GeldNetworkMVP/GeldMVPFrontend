import { TokensStateModel } from "./tokens-state.type";

const STAGES_ACTION_KEY = '[Tokens]';

export class SetTokens {
  static readonly type = `${STAGES_ACTION_KEY} Set Tokens`;

  constructor(public tokens: TokensStateModel['tokens']) {}
}

export class SetTokensLoading {
  static readonly type = `${STAGES_ACTION_KEY} Set Tokens Loading`;

  constructor(public loading: boolean) {}
}