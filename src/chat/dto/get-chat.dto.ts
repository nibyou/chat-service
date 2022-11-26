import { Chat } from '../schemata/chat.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../../message/schemata/message.schema';

export class ChatsWithLastMessagesDto {
  @ApiProperty({
    type: () => [ChatWithLastMessage],
  })
  chats: ChatWithLastMessage[];
}

export class ChatWithLastMessage {
  @ApiProperty()
  chat: Chat;
  @ApiProperty()
  lastMessage: Message;
}
