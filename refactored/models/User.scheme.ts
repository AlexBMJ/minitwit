import mongoose, { Model } from 'mongoose';

const { Schema } = mongoose;

export interface TUser {
  user_id: string;
  username: string;
  email: string;
  pw_hash: string;
}

const UserSchema = new Schema<TUser>({
  user_id: {
    type: String,
    required: true,
  },
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

var User = <Model<TUser>>mongoose.models.Child || mongoose.model<TUser, Model<TUser>>('User', UserSchema);
export default User;
