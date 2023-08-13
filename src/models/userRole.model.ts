import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "UserRoles" })
export default class UserRole extends Model<UserRole> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    role!: string;
}
