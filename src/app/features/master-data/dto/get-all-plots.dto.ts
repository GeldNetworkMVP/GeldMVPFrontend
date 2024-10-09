import { Plot } from "../models/plot.model"

export interface GetAllPlotsDto {
    Status: number
    Response: Plot[]
}