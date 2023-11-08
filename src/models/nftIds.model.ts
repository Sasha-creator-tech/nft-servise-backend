import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import NFTToken from "./nftTokens.model";
import UserBalance from "./userBalance.model";

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
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isUsed: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    amount?: number;

    @HasMany(() => UserBalance)
    userBalances: UserBalance[];
}
