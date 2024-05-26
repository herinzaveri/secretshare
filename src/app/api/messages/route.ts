import {NextRequest} from 'next/server';
import {dbConnect} from '../db/mongo';
import Message from '../models/product.model';
import {incrReadCount, incrWriteCount} from '@/app/metrics';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';

  await dbConnect();

  let message = await Message.findOne({_id: id, ttl: {$gte: Date.now()}});

  if (!message) {
    return Response.json({error: 'Not Found'}, {status: 404});
  }
  if (message.maxReads <= message.reads) {
    return Response.json({error: 'Not Found'}, {status: 404});
  }

  message = await Message.findOneAndUpdate({_id: id}, {
    reads: message.reads + 1,
  }, {new: true});

  await incrReadCount();

  return Response.json(message);
}

export async function POST(request: Request) {
  const {encryptedText, ttl, reads, iv} = await request.json();

  await dbConnect();

  const message = new Message({
    encryptedText,
    ttl: Date.now() + ttl,
    maxReads: reads,
    reads: 0,
    iv,
  });

  await message.save();

  await incrWriteCount();

  return Response.json(message);
}
