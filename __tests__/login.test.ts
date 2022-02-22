import { AuthRequest } from '../middleware/authentication';
import User, { TUser } from '../models/User.scheme';
import * as httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { TestAPIResponse } from '../types/tests';
import login from '../pages/api/login';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Follow from '../models/Follower.schema';
import Message from '../models/Message.schema';
import { removeAllDataFromDB } from '../helpers/test_helper';

describe('Login tests', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  let userObject: TUser;
  let bearerToken: string;

  beforeAll(async () => {
    // Setup Memory DB
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(process.env.MONGO_URL!);
    await mongoose.connection.useDb('minitwit');

    await removeAllDataFromDB(true);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('1234', salt);
    const newUser = await new User({
      username: 'bech',
      admin: false,
      email: 'milb@itu.dk',
      pw_hash: hash,
    }).save();
    userObject = newUser;
    bearerToken = await jwt.sign({ userid: userObject._id!.toString() }, process.env.TOKEN_SECRET!);
  });

  beforeEach(async () => {
    // Cleans up entire db

    const mockHTTP = httpMocks.createMocks({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Login successfully with bearer', async () => {
    req.headers.authorization = `Bearer ${bearerToken}`;
    await login(req, res);

    expect(res._getJSONData().token).toBe(bearerToken);
    expect(res._getJSONData().message).toBe(`Logged in as ${userObject.username.toLowerCase()}.`);
    expect(res.statusCode).toBe(200);
  });

  it('Login with incorrect details', async () => {
    // Random bearer
    req.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MjE1MmVkZjllN2Q2ZDk3NDIyOGJkMjcifQ.m4SHH08j8H_m_x65YHkAWeWHeCv9eZqwQWD1BtPShhI`;
    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Incorrect username or password!');
  });

  it('Wrong method', async () => {
    req.method = 'PUT';

    await login(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Bad request!');
  });

  it('Login successfull with GET', async () => {
    req.method = 'GET';
    req.headers.authorization = `Bearer ${bearerToken}`;
    await login(req, res);

    const actual = res._getData();

    const expected = await User.findById(userObject._id);

    expect(actual).toBe(JSON.stringify({ user: expected }));
    expect(res.statusCode).toBe(200);
  });

  it('Login unsuccessfull with GET', async () => {
    req.method = 'GET';

    await login(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toBe('Unauthorized');
  });
});
