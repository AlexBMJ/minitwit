import { TMessage } from '../models/Message.schema';

export type UserInfo = { username: string; email: string; messages: TMessage[] };
