import mongoose, { Model, Types } from 'mongoose';

const { Schema } = mongoose;

export interface TFollower {
  follower_id: Types.ObjectId;
  other_id: Types.ObjectId;
}

const FollowSchema = new Schema<TFollower>({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  other_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

FollowSchema.index({follower_id: 1, other_id: 1})

const Follow = <Model<TFollower>>mongoose.models.Follow || mongoose.model<TFollower, Model<TFollower>>('Follow', FollowSchema);
export default Follow;
