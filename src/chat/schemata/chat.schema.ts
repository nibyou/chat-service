import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  @ApiProperty({
    description: 'Group chats have an admin',
    type: 'string',
    format: 'uuid',
  })
  admin?: string;

  @Prop()
  @ApiProperty({
    description:
      'Group chats have a name, p2p chats are named after the other user',
  })
  name?: string;

  @Prop()
  @ApiProperty({
    type: [String],
  })
  members: string[];

  @Prop()
  @ApiProperty({
    description: 'Used for sorting chats',
  })
  lastMessageAt: Date;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  _id: string;

  @Prop()
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
