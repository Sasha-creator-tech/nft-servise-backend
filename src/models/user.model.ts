import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import UserRole from "./userRole.model";

@Table({ tableName: "Users" })
export default class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    user_address!: string;

    @ForeignKey(() => UserRole)
    roleId: number;

    @BelongsTo(() => UserRole)
    role: UserRole;
}
