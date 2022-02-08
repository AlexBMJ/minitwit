import mongoose, { Model } from 'mongoose';

const { Schema } = mongoose;

export interface TUser {
  user_id: number;
  username: string;
  email: string;
  pw_hash: string;
}

const UserSchema = new Schema<TUser>({
  user_id: {
    required: true,
  },
  username: {
    required: true,
  },
  email: {
    required: true,
  },
  pw_hash: {
    required: true,
  },
});

var User = <Model<TUser>>mongoose.models.Child || mongoose.model<TUser, Model<TUser>>('User', UserSchema);
export default User;
