import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';

export type ChatDocument = Chat & Document;

@Schema()
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

  @Prop({
    default(): any {
      return new Date().toISOString();
    },
  })
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  updatedAt: Date;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
