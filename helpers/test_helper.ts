import Follow from '../models/Follower.schema';
import Message from '../models/Message.schema';
import User from '../models/User.scheme';

export async function removeAllDataFromDB(areYouSure: boolean = false) {
  if (areYouSure) {
    await User.deleteMany({});
    await Follow.deleteMany({});
    await Message.deleteMany({});
  } else {
    console.log('Did not delete anything!');
  }
}
