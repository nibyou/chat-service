import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attachment, AttachmentSchema } from './schemata/attachment.schema';
import { Chat, ChatSchema } from '../chat/schemata/chat.schema';
import { Message, MessageSchema } from '../message/schemata/message.schema';
import { ChatModule } from '../chat/chat.module';

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService],
  imports: [
    MongooseModule.forFeature([
      { name: Attachment.name, schema: AttachmentSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    ChatModule,
  ],
  exports: [AttachmentService],
})
export class AttachmentModule {}
