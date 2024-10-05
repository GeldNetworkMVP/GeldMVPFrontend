import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SetStages, SetStagesLoading } from './stages-data.actions';
import { StagesStateModel } from './stages-state.type';

@State<StagesStateModel>({
  name: 'stages',
  defaults: {
    stages: [],
    stagesLoading: false,
  },
})
@Injectable()
export class StagesState {
  // define selectors
  @Selector()
  static getStages(state: StagesStateModel) {
    return state.stages;
  }

  @Selector()
  static getStagesLoading(state: StagesStateModel) {
    return state.stagesLoading;
  }

  // define actions
  @Action(SetStages)
  setStages(ctx: StateContext<StagesStateModel>, action: SetStages) {
    ctx.patchState({
      stages: action.stages,
    });
  }

  @Action(SetStagesLoading)
  setMasterDataContainersLoading(
    ctx: StateContext<StagesStateModel>,
    action: SetStagesLoading
  ) {
    ctx.patchState({
      stagesLoading: action.loading,
    });
  }
}
