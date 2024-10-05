import { StagesStateModel } from "./stages-state.type";

const STAGES_ACTION_KEY = '[Stages]';

export class SetStages {
  static readonly type = `${STAGES_ACTION_KEY} Set Stages`;

  constructor(public stages: StagesStateModel['stages']) {}
}

export class SetStagesLoading {
  static readonly type = `${STAGES_ACTION_KEY} Set Stages Loading`;

  constructor(public loading: boolean) {}
}