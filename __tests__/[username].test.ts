import username from '../pages/api/[username]';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { removeAllDataFromDB } from '../helpers/test_helper';
import User from '../models/User.scheme';
import bcrypt from 'bcryptjs';

describe('given existing user', () => {
  beforeAll(async () => {
    // Setup Memory DB
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(process.env.MONGO_URL!);
    mongoose.connection.useDb('minitwit');

    await removeAllDataFromDB(true);

    const hash = await bcrypt.hash('1234', 10);
    await new User({
      username: 'bech',
      admin: false,
      email: 'milb@itu.dk',
      pw_hash: hash,
    }).save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should respond with a 200 status code and user data', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        username: 'bech',
      },
    });

    const res = httpMocks.createResponse();
    await username(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.username).toBe('bech');
    expect(data.email).toBe('milb@itu.dk');
    expect(data.messages).toStrictEqual([]);
  });
});
