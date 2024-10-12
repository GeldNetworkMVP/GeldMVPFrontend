import { Stage } from "../models/stage.model";

export type SaveStageDto = Omit<Stage, '_id'>