import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';
import { Chat } from '../../chat/schemata/chat.schema';
import { Attachment } from '../../attachment/schemata/attachment.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' } })
  @ApiProperty({
    description: 'Chat the message belongs to',
    type: () => Chat,
  })
  chat: Chat;

  @Prop()
  @ApiProperty({
    description: 'Encrypted message contents',
    type: 'string',
  })
  message: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    default: [],
  })
  @ApiPropertyOptional({
    type: () => [Attachment],
  })
  attachments?: Attachment[];

  @Prop()
  @ApiProperty({
    description: 'Message sender',
    type: 'string',
    format: 'uuid',
  })
  sender: string;

  @Prop({ type: () => GlobalStatus, default: GlobalStatus.ACTIVE })
  @ApiProperty()
  status: GlobalStatus;

  @Prop()
  @ApiProperty({
    type: [String],
    format: 'uuid',
  })
  readBy: string[];

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

export const MessageSchema = SchemaFactory.createForClass(Message);
