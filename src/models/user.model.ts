import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Users" })
export default class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    user_address!: string;
}
