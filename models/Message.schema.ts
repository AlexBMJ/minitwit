import mongoose, { Model, Types } from 'mongoose';

const { Schema } = mongoose;

export interface TMessage {
  author_id: Types.ObjectId;
  author_name: string;
  text: string;
  pub_date: Date;
  flagged: boolean;
}

const MessageSchema = new Schema<TMessage>({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  author_name: {
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

MessageSchema.index({author_id: 1});

var Message =
  <Model<TMessage>>mongoose.models.Message || mongoose.model<TMessage, Model<TMessage>>('Message', MessageSchema);
export default Message;
