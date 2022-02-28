import username from '../pages/api/[username]';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { removeAllDataFromDB } from '../helpers/test_helper';
import User, { TUser } from '../models/User.scheme';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authentication';
import { TestAPIResponse } from '../types/tests';

describe('username tests', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  let user: TUser;
  beforeAll(async () => {
    // Setup Memory DB
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(global.__MONGO_URI__!);
    mongoose.connection.useDb('minitwit');

    const hash = await bcrypt.hash('1234', 10);
    user = await new User({
      username: 'bech',
      admin: false,
      email: 'milb@itu.dk',
      pw_hash: hash,
    }).save();
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'GET',
      url: '/api',
      query: {
        username: 'bech',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  it('should respond with a 200 status code and user data', async () => {
    await username(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.username).toBe('bech');
    expect(data.email).toBe('milb@itu.dk');
    expect(data.messages).toStrictEqual([]);
  });

  it('should respond with a 404 status code non existing user', async () => {
    req.query.username = 'iDontExist';
    await username(req, res);
    expect(res.statusCode).toBe(404);
  });

  it('should respond with a 400 status code for missing username', async () => {
    req.query.username = '';
    await username(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('No username!');
  });

  it('should respond with a 400 status code delete request', async () => {
    req.method = 'delete';
    await username(req, res);
    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await removeAllDataFromDB(true);
  await mongoose.connection.close();
});
