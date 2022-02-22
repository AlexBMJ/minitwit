import { NextApiResponse } from 'next';
import { AuthRequest } from '../middleware/authentication';
import register from '../pages/api/register';
import User, { TUser } from '../models/User.scheme';
import Message from '../models/Message.schema';
import * as httpMocks from 'node-mocks-http';
import mongoose, { Mongoose } from 'mongoose';
import * as MongoClient from 'mongodb';

interface TestAPIResponse extends NextApiResponse {
  _getJSONData: () => any;
  _getData: () => any;
}

describe('Register tests', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  beforeAll(async () => {
    // JEST automatically sets MONGO_URL to the memory db
    await mongoose.connect(process.env.MONGO_URL!);
    await mongoose.connection.useDb('minitwit');
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: {
        username: 'BECH',
        email: 'milb@itu.dk',
        pwd: '1234',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Register successfully', async () => {
    await register(req, res);

    expect(res.statusCode).toBe(204);
  });

  it('Register user already found', async () => {
    await new User({
      username: 'bech',
      admin: false,
      email: 'milb@itu.dk',
      pw_hash: '1234',
    }).save();
    await register(req, res);

    //console.log(res._getData());
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toEqual('User with that email was already found!');
  });

  it('Register user without body', async () => {
    req.body = { username: null, email: null, pwd: null }; // Remove body
    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toEqual('Username, email and password must be set!');
  });

  it('Register with colon in username', async () => {
    req.body = { ...req.body, username: 'BE:CH' }; // Remove body
    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toEqual('Username cannot contain the colon character');
  });

  it('Register GET returns user', async () => {
    req.authenticated = true;
    req.method = 'GET';
    const user: TUser = { admin: false, email: 'milb@itu.dk', pw_hash: '1234', username: 'BECH' };
    req.user = user;
    await register(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().user).toEqual(req.user);
  });
});
