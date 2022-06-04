import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  @ApiProperty({
    description: 'Chat id the message belongs to',
    type: 'string',
    format: 'uuid',
  })
  chat: string;

  @Prop()
  @ApiProperty({
    description: 'Encrypted message contents',
    type: 'string',
  })
  message: string;

  @Prop()
  @ApiProperty({
    description: 'Encrypted attachments for the message',
    type: [String],
  })
  attachments: string[];

  @Prop()
  @ApiProperty({
    description: 'Message sender',
    type: 'string',
    format: 'uuid',
  })
  sender: string;

  @Prop({ default: () => new Date().toISOString() })
  @ApiProperty({
    description: 'Message timestamp',
  })
  timestamp: Date;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @Prop()
  @ApiProperty({
    type: [String],
  })
  readBy: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
