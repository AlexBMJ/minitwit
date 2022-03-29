import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { removeAllDataFromDB } from '../helpers/test_helper';
import User, { TUser } from '../models/User.scheme';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authentication';
import { TestAPIResponse } from '../types/tests';
import * as jwt from 'jsonwebtoken';
import Follow from '../pages/api/fllws/[username]';
jest.mock('../app/logger');

describe('POST methods for Follow and unfollow tests', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  let firstUser: TUser;
  let secondUser: TUser;
  let bearerTokenForFirstUser: string;
  let bearerTokenForSecondUser: string;

  beforeAll(async () => {
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(global.__MONGO_URI__!);
    await mongoose.connection.useDb('minitwit');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('1234', salt);

    firstUser = await new User({
      username: 'deniz',
      admin: false,
      email: 'deni@itu.dk',
      pw_hash: hash,
    }).save();

    secondUser = await new User({
      username: 'bech',
      admin: false,
      email: 'milb@itu.dk',
      pw_hash: hash,
    }).save();

    bearerTokenForFirstUser = await jwt.sign({ userid: firstUser._id!.toString() }, process.env.TOKEN_SECRET!);
    bearerTokenForSecondUser = await jwt.sign({ userid: secondUser._id!.toString() }, process.env.TOKEN_SECRET!);
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      authenticated: `Bearer ${bearerTokenForFirstUser}`,
      user: {
        username: 'deniz',
      },
      body: {
        follow: 'bech',
      },
      query: {
        username: 'deniz',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  it('POST - Should return 204 for following existing user', async () => {
    await Follow(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('POST - Should return 204 for unfollowing existing user', async () => {
    // follow the user here
    await Follow(req, res);

    req.body.unfollow = 'bech';
    await Follow(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('POST - Should return 404 for following non existing user', async () => {
    req.query.username = 'i do not exist';
    await Follow(req, res);
    expect(res.statusCode).toBe(404);
  });

  it('POST - Should return 403 for unauthorized user', async () => {
    req.authenticated = false;
    await Follow(req, res);
    expect(res.statusCode).toBe(403);
  });

  it('GET - Should return 200 for following user', async () => {
    // Start by following the user
    await Follow(req, res);

    req.method = 'GET';
    req.query.isfollowing = 'bech';

    await Follow(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().user).toBe('bech');
    expect(res._getJSONData().isfollowing).toBe(true);
  });

  it('POST - It should return 204 for unfollowing user', async () => {
    delete req.body.follow;
    req.body.unfollow = 'bech';
    await Follow(req, res);

    expect(res.statusCode).toBe(204);
  });

  it('GET - It should return 403 unaothorized', async () => {
    req.method = 'GET';
    req.authenticated = false;
    req.query.isfollowing = 'bech';
    await Follow(req, res);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData().message).toBe('Unauthorized');
  });
});

afterAll(async () => {
  await removeAllDataFromDB(true);
  await mongoose.connection.close();
});
