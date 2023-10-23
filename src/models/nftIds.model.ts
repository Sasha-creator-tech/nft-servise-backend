import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import NFTToken from "./nftTokens.model";

@Table({ tableName: "NFTIds" })
export default class NftId extends Model<NftId> {
    @ForeignKey(() => NFTToken)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    nft_token_id!: number;

    @BelongsTo(() => NFTToken)
    nftToken: NFTToken;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    onchain_id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    amount?: number;
}
