import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @ApiProperty({
    type: String,
    format: 'base64',
  })
  rawData: string;

  @Prop()
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
