import { AuthRequest } from '../middleware/authentication';
import register from '../pages/api/register';
import User, { TUser } from '../models/User.scheme';
import * as httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { TestAPIResponse } from '../types/tests';
import { removeAllDataFromDB } from '../helpers/test_helper';
import Message from '../models/Message.schema';
import MessagesFromUser from '../pages/api/msgs';
import mock = jest.mock;

describe('GET requests for messages per user', () => {
    let req: AuthRequest;
    let res: TestAPIResponse;

    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL!);
        await mongoose.connection.useDb('minitwit');
        await removeAllDataFromDB(true);

        await new User({
            username: 'deniz',
            admin: false,
            email: 'deni@itu.dk',
            pw_hash: '123',
        }).save()
    });

    beforeEach(async () => {
        const mockHTTP = httpMocks.createMocks({
            method: 'GET',
            headers: { 'content-type': 'application/json' },
            query : {
                amount : "1",
            }
        });
        req = mockHTTP.req
        res = mockHTTP.res
    })

    afterAll(async() => {
        mongoose.connection.close()
    });

    it('Should return statuscode 400 for NaN', async () => {
        req.query.amount = "qwnwegjkw123"
        await MessagesFromUser(req, res)
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData().message).toEqual('Not a number...');

    });

    it('Should return statuscode 200 for valid number', async () => {
         await MessagesFromUser(req, res)
        expect(res.statusCode).toBe(200);
    });
})