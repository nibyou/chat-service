import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GlobalStatus } from '@nibyou/types';

export type ChatDocument = Chat & Document;

export enum MemberType {
  PRACTITIONER = 'PRACTITIONER',
  PATIENT = 'PATIENT',
}

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  @ApiPropertyOptional({
    description: 'Group chats have an admin',
    type: 'string',
    format: 'uuid',
  })
  admin?: string;

  @Prop()
  @ApiPropertyOptional({
    description:
      'Group chats have a name, p2p chats should show name of the other user',
  })
  name?: string;

  @Prop()
  @ApiProperty({
    type: [String],
    format: 'uuid',
  })
  members: string[];

  @Prop()
  @ApiProperty({
    enum: MemberType,
  })
  memberType: MemberType;

  @Prop()
  @ApiProperty({
    description: 'Used for sorting chats',
  })
  lastMessageAt: Date;

  @Prop()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  keyId: string;

  @Prop({
    default: () => [],
  })
  @ApiProperty({
    type: [String],
  })
  attachments: string[];

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
