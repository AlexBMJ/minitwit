import mongoose from 'mongoose';
import { removeAllDataFromDB } from '../helpers/test_helper';
import { get_user } from '../helpers/user_helper';
import User, { TUser } from '../models/User.scheme';

describe('Test user helper', () => {
  let firstUser:
    | (mongoose.Document<unknown, any, TUser> &
        TUser & {
          _id: mongoose.Types.ObjectId | undefined;
        })
    | null;

  beforeAll(async () => {
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(process.env.MONGO_URL!);
    await mongoose.connection.useDb('minitwit');

    firstUser = await new User({
      username: 'deniz',
      admin: false,
      email: 'deni@itu.dk',
      pw_hash: '1234',
    }).save();
  });

  it('get_user by id should return user', async () => {
    const expected = await get_user({ _id: firstUser!._id });

    expect(expected?.toJSON()).toEqual(firstUser?.toJSON());
  });

  it('get_user by email should return user', async () => {
    const expected = await get_user({ email: firstUser!.email });

    expect(expected?.toJSON()).toEqual(firstUser?.toJSON());
  });

  it('get_user by nothing should return null', async () => {
    const expected = await get_user({ admin: true });

    expect(expected).toBe(null);
  });
});

afterAll(async () => {
  await removeAllDataFromDB(true);
  await mongoose.connection.close();
});
