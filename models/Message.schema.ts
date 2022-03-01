import mongoose, { Model, Types } from 'mongoose';

const { Schema } = mongoose;

export interface TMessage {
  author_id: Types.ObjectId;
  username: string;
  text: string;
  pub_date: Date;
  flagged: boolean;
}

const MessageSchema = new Schema<TMessage>({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  pub_date: {
    type: Date,
    required: true,
  },
  flagged: {
    type: Boolean,
    required: true,
  },
});

var Message =
  <Model<TMessage>>mongoose.models.Message || mongoose.model<TMessage, Model<TMessage>>('Message', MessageSchema);
export default Message;
