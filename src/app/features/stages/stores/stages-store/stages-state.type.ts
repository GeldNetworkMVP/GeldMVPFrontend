import { Stage } from "../../models/stage.model";

export interface StagesStateModel {
  stages: Stage[];
  stagesLoading: boolean;
}
