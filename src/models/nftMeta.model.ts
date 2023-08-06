import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import NftId from "./nftIds.model";

@Table({ tableName: "NFTMeta" })
export default class NftMeta extends Model<NftMeta> {
    @ForeignKey(() => NftId)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    nft_ids_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    })
    title?: string;
}
