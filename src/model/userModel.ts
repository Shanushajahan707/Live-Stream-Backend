import mongoose ,{Schema,Document} from 'mongoose'

export interface UserDocument extends Document{
    username:string
    email:string
    password:string
    role:string
    dateofbirth:Date,
    isblocked:boolean
}

const UserSchema:Schema<UserDocument>=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true,default:'user'},
    dateofbirth:{type:Date,required:true},
    isblocked:{type:Boolean,required:true}
})

export const UserModel=mongoose.model<UserDocument>('user',UserSchema)