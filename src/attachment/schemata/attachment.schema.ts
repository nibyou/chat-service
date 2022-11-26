import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Chat } from '../../chat/schemata/chat.schema';

export type AttachmentDocument = Attachment & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Prop()
  @ApiProperty()
  fileType: string;

  @Prop()
  @ApiProperty()
  fileName?: string;

  @Prop()
  @ApiPropertyOptional({
    type: String,
    format: 'base64',
  })
  rawData?: string;

  @Prop()
  @ApiPropertyOptional()
  url?: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' } })
  @ApiProperty({
    type: () => Chat,
  })
  chat: Chat;

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

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
