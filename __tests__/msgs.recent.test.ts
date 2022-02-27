import mongoose from 'mongoose';
import { removeAllDataFromDB } from '../helpers/test_helper';
import { AuthRequest } from '../middleware/authentication';
import User, { TUser } from '../models/User.scheme';
import { TestAPIResponse } from '../types/tests';
import * as httpMocks from 'node-mocks-http';
import recent from '../pages/api/msgs/recent';
import Message from '../models/Message.schema';

describe('Test recent messages', () => {
  let req: AuthRequest;
  let res: TestAPIResponse;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!);
    await mongoose.connection.useDb('minitwit');
    await removeAllDataFromDB(true);
  });

  beforeEach(async () => {
    const mockHTTP = httpMocks.createMocks({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      query: {
        amount: '5',
      },
    });
    req = mockHTTP.req;
    res = mockHTTP.res;
  });

  it('Should return invalid method', async () => {
    req.method = 'POST';
    await recent(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Method not supported!');
  });

  it('Should return not a number', async () => {
    req.query.amount = 'awsd';
    await recent(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Not a number...');
  });

  it('Should return the recent messages', async () => {
    const messageOne = await new Message({
      author_id: new mongoose.Types.ObjectId(),
      author_name: 'bech',
      flagged: false,
      pub_date: new Date(),
      text: 'WWW',
    }).save();

    const messageTwo = await new Message({
      author_id: new mongoose.Types.ObjectId(),
      author_name: 'deniz',
      flagged: false,
      pub_date: new Date(),
      text: 'LLL',
    }).save();

    await recent(req, res);

    const messages = JSON.stringify([
      { ...messageTwo.toJSON(), pub_date: messageTwo.pub_date.toISOString() },
      { ...messageOne.toJSON(), pub_date: messageOne.pub_date.toISOString() },
    ]);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().messages.length).toBe(2);
    expect(res._getJSONData().messages).toEqual(JSON.parse(messages));
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
