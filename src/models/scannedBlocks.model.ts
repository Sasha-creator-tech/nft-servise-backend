import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "ScannedBlocks" })
export default class ScannedBlocks extends Model<ScannedBlocks> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    chainId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address!: string;

    @Column({
        type: DataType.INTEGER,
    })
    scannedBlocks!: number;
}
