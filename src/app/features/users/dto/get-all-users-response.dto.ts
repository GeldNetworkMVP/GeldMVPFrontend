import { User } from "../models/user.model";

export interface GetAllUsersResponseDto {
    Status: number;
    Response: User[];
}