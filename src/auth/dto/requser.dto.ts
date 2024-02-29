import { Role } from "../schema";

export interface ReqUser{
    id: string;
    roles: Role[];
}