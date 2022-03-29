import { AuthRequest } from '../middleware/authentication';
import User, { TUser } from '../models/User.scheme';
import * as httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { TestAPIResponse } from '../types/tests';
import { removeAllDataFromDB } from '../helpers/test_helper';
import MessagesFromUser from '../pages/api/msgs/[username]';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Message from '../models/Message.schema';
jest.mock('../app/logger');

describe('GET requests for messages per user', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  let user: TUser;
  //jest.spyOn(logger, 'info').mockImplementation();
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__!);
    await mongoose.connection.useDb('minitwit');

    user = await new User({
      username: 'deniz',
      admin: false,
      email: 'deni@itu.dk',
      pw_hash: '123',
    }).save();
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      query: {
        no: '5',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  it('Should return statuscode 400 for NaN', async () => {
    req.query.no = 'qwnwegjkw123';
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toEqual('Not a number...');
  });

  it('Should return statuscode 200 for valid number', async () => {
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(200);
  });

  it('Should return the messages for a valid number', async () => {
    req.query.username = user.username;
    const newMessage = await new Message({
      author_id: user._id,
      username: user.username,
      flagged: false,
      pub_date: new Date(),
      text: 'Lets go',
    }).save();

    await MessagesFromUser(req, res);
    // I need to stringify and make the date into a string....
    const obj = JSON.stringify({ ...newMessage.toJSON(), pub_date: newMessage.pub_date.toISOString() });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      messages: [JSON.parse(obj)],
    });
  });
});

describe('POST requests for messages of a new user', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;
  let userObject: TUser;
  let bearerToken: string;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__!);
    await mongoose.connection.useDb('minitwit');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123', salt);
    userObject = await new User({
      username: 'deniz',
      admin: true,
      email: 'deni@itu.dk',
      pw_hash: hash,
    }).save();

    bearerToken = await jwt.sign({ userid: userObject._id!.toString() }, process.env.TOKEN_SECRET!);
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${bearerToken}` },
      query: {
        username: 'deniz',
      },
      body: {
        content: 'my first post',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  it('should return 204 for existing user', async () => {
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for non existing user', async () => {
    req.query.username = 'nonexisting';
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().message).toBe('No USER');
  });

  it('should return 403 for unauthorized user', async () => {
    req.headers.authorization = 'wefwenmjk1231';
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData().message).toBe('Unauthorized');
  });

  it('should return 400 missing data for no content', async () => {
    req.body.content = '';
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Missing data');
  });

  it('should return 400 method not supported', async () => {
    req.method = 'Delete';
    await MessagesFromUser(req, res);
    expect(res.statusCode).toBe(405);
    expect(res._getJSONData().message).toBe('Method not accepted!');
  });
});

afterAll(async () => {
  await removeAllDataFromDB(true);
  await mongoose.connection.close();
});
