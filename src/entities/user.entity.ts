import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Schema as MongooseSchema } from "mongoose";


@Schema()
export class User extends Document {

    @Prop({required:true})
    name: string;

    @Prop({required : true, unique: true})
    email: string;

    @Prop({required : false})
    mobile : string;

    @Prop({ required: false  })
    password: string;

    @Prop()
    refreshToken: string;

    @Prop({ required: true, default:true})
    isactive: boolean;

    @Prop({ required: true, default:false})
    isdeleted: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: false })
    updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);