import User from "../models/user.model";

export class UserRoleService {
    public isHasRole(user: User, roles: string[]): boolean {
        return roles.includes(user?.role?.role);
    }
}

export const userSoleService = new UserRoleService();
