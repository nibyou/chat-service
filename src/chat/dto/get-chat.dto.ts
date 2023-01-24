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

export class ChatsWithLastMessageAndUserInfoDto {
  @ApiProperty({
    type: () => [ChatWithLastMessageAndUserInfo],
  })
  chats: ChatWithLastMessageAndUserInfo[];
}

export class ChatWithLastMessageAndUserInfo extends ChatWithLastMessage {
  @ApiProperty({
    type: () => [UserProfileData],
  })
  users: UserProfileData[];
}

export class UserProfileData {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  userId: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  profileImage: string;
}
