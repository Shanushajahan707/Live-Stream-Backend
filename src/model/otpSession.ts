import mongoose ,{Schema,Document} from 'mongoose'

export interface OtpDocument extends Document{
    otp: number;
    email: string;
    createdAt: object;
}   

const otpSchema = new Schema({
 otp: {type:Number,required:true},
 email: {type:String,required:true},
 createdAt: { type: Date, expires: '1m', default: Date.now }
});

export const otpModel = mongoose.model<OtpDocument>('Otp', otpSchema);