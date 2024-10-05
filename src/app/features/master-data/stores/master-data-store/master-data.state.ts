import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { MasterDataStateModel } from './master-data-state.type';
import {
  SetMasterDataContainers,
  SetMasterDataContainersLoading,
} from './master-data.actions';

@State<MasterDataStateModel>({
  name: 'masterData',
  defaults: {
    masterDataContainers: [],
    masterDataContainersLoading: false,
  },
})
@Injectable()
export class MasterDataState {
  // define selectors
  @Selector()
  static getMasterData(state: MasterDataStateModel) {
    return state.masterDataContainers;
  }

  @Selector()
  static getMasterDataLoading(state: MasterDataStateModel) {
    return state.masterDataContainersLoading;
  }

  // define actions
  @Action(SetMasterDataContainers)
  setMasterDataContainer(
    ctx: StateContext<MasterDataStateModel>,
    action: SetMasterDataContainers
  ) {
    ctx.patchState({
      masterDataContainers: action.masterDataContainer,
    });
  }

  @Action(SetMasterDataContainersLoading)
  setMasterDataContainersLoading(
    ctx: StateContext<MasterDataStateModel>,
    action: SetMasterDataContainersLoading
  ) {
    ctx.patchState({
      masterDataContainersLoading: action.loading,
    });
  }
}
