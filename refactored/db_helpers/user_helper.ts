import { Model, models, Mongoose, Types } from 'mongoose';
import Follow from '../models/Follower.schema';
import User from '../models/User.scheme';
import { TUser } from '../models/User.scheme';

export async function get_user(user: Partial<TUser>) {
  if (user._id) {
    return await User.findById(user._id);
  } else if (user.username) {
    return await User.findOne({ username: user.username });
  } else if (user.email) {
    return await User.findOne({ email: user.email });
  } else {
    return null;
  }
}

export async function follow(userid1: Types.ObjectId, userid2: Types.ObjectId) {
  if (!(await Follow.findOne({ follower_id: userid1, other_id: userid2 }))) {
    await new Follow({ follower_id: userid1, other_id: userid2 }).save();
  }
}

export async function unfollow(userid1: Types.ObjectId, userid2: Types.ObjectId) {
  await Follow.findOneAndDelete({ follower_id: userid1, other_id: userid2 });
}
