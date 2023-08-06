import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import User from "./user.model";
import NftId from "./nftIds.model";

@Table({ tableName: "UsersBalances" })
export default class UserBalance extends Model<UserBalance> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => NftId)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    nft_ids_id!: number;

    @BelongsTo(() => NftId)
    nftId: NftId;
}
