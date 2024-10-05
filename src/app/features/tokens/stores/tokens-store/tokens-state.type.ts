import { Token } from "../../models/token.model";

export interface TokensStateModel {
  tokens: Token[];
  tokensLoading: boolean;
}
