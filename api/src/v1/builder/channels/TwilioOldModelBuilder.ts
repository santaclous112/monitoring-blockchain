import mongoose, { Model, Schema } from "mongoose";
import { Channel } from "../../../../../entities/ts/channels/AbstractChannel";
import { Collection, ModelName } from "../../../constant/mongoose";
import { MongooseUtil } from "../../../util/MongooseUtil";
import { IModelBuilder } from "../IModelBuilder";
import { TwilioModelBuilder } from "./TwilioModelBuilder";

/**
 * Builder to create Mongoose Schema and Model of Config Entity
 */
export class TwillioOldModelBuilder implements IModelBuilder<Channel> {

    private _schema: Schema = null;
    private _model: Model<Channel> = null;

    public produceSchema(): void {

        //make copy
        const builder = new TwilioModelBuilder()
        builder.produceSchema();

        this._schema = builder.schema;

        MongooseUtil.virtualize(this._schema);
    }

    public produceModel(): void {
        this._model = mongoose.model(
            ModelName.TWILIO_OLD,
            this._schema,
            Collection.CONFIG_OLD
        ) as Model<Channel>;
    }

    public get model(): Model<Channel> {
        return this._model;
    }

    public get schema(): Schema {
        return this._schema;
    }
}
