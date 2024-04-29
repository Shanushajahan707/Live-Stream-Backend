import mongoose ,{Schema,Document} from 'mongoose'

export interface optDocument extends Document{
    otp:string
    email:string
    createdAt:object
}

const otpSchema:Schema<optDocument>=new Schema({
    otp:{type:String,required:true},
    email:{type:String,required:true},
    createdAt:{type:Date,expires:'30s',default:Date.now()},
   
})

export const otpModel=mongoose.model<optDocument>('Otpcollection',otpSchema)