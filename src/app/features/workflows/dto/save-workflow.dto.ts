import { Workflow } from "../models/workflow.model";

export type SaveWorkflowDto = Omit<Workflow, '_id'>