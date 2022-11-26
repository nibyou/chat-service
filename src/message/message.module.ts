import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemata/message.schema';
import { Chat, ChatSchema } from '../chat/schemata/chat.schema';
import { AttachmentModule } from '../attachment/attachment.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
    AttachmentModule,
    ChatModule,
  ],
})
export class MessageModule {}
