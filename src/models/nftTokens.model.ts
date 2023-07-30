import {
    Column,
    Model,
    Table,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Brand from "./brands.model";

@Table({ tableName: "NFTTokens" })
export default class NFTToken extends Model<NFTToken> {
    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    })
    title?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    address!: string;

    @ForeignKey(() => Brand)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    brand_id!: number;

    @BelongsTo(() => Brand)
    brand!: Brand;
}
