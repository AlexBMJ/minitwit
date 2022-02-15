import mongoose, { Model, Types} from 'mongoose';

const { Schema } = mongoose;

export interface TUser {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  pw_hash: string;
}

const UserSchema = new Schema<TUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pw_hash: {
    type: String,
    required: true,
  },
});

var User = <Model<TUser>>mongoose.models.User || mongoose.model<TUser, Model<TUser>>('User', UserSchema);
export default User;
