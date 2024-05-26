import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
      encryptedText: {
        type: String,
      },
      maxReads: {
        type: Number,
      },
      reads: {
        type: Number,
      },
      iv: {
        type: String,
      },
      ttl: {
        type: Date,
      },
    },
    {
      timestamps: true,
    },
);

const Message = mongoose.models.messages || mongoose.model('messages', messageSchema);

export default Message;
