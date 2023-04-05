import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemata/chat.schema';
import { Message, MessageSchema } from '../message/schemata/message.schema';
import { ChatGateway } from './chat.gateway';
import {
  Attachment,
  AttachmentSchema,
} from '../attachment/schemata/attachment.schema';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
    forwardRef(() => MessageModule),
  ],
  exports: [ChatService],
})
export class ChatModule {}
