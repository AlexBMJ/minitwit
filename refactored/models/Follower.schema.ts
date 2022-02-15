import mongoose, { Model } from 'mongoose';

const { Schema } = mongoose;

export interface TFollower {
  follower_id: string;
  followee_id: string;
}

const FollowSchema = new Schema<TFollower>({
  follower_id: {
    type: String,
    required: true,
  },
  followee_id: {
    type: String,
    required: true,
  },
});

var User =
  <Model<TFollower>>mongoose.models.Follow || mongoose.model<TFollower, Model<TFollower>>('Follow', FollowSchema);
export default User;
