import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Brands" })
export default class Brand extends Model<Brand> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url!: string;
}
