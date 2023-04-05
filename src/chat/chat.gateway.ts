import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import 'dotenv/config';
import { AuthUser } from '@nibyou/types';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Message, MessageDocument } from '../message/schemata/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Attachment,
  AttachmentDocument,
} from '../attachment/schemata/attachment.schema';
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { HttpException } from '@nestjs/common';

export enum Events {
  USER_JOINED = 'USER_JOINED',
  USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
  JOIN = 'JOIN',
  MESSAGE = 'MESSAGE',
  NEW_MESSAGE = 'NEW_MESSAGE',
  ERROR = 'ERROR',
}

export interface ServerToClientEvents {
  [Events.ERROR]: (error: string) => void;
  [Events.NEW_MESSAGE]: (message: Message) => void;
  [Events.USER_JOINED]: (userId: string) => void;
  [Events.USER_NOT_AUTHENTICATED]: (error: string) => void;
}

export interface ClientToServerEvents {
  [Events.JOIN]: (callback: (rooms: string[]) => void) => void;
  [Events.MESSAGE]: (
    message: CreateMessageDto,
    callback: (message: Message) => void,
  ) => void;
}

@WebSocketGateway(3001, {
  namespace: 'chat',
  cors: {
    origin: process.env.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<AttachmentDocument>,
  ) {}

  @SubscribeMessage(Events.JOIN)
  async joinChatRooms(client: Socket): Promise<string[]> {
    const user = await this.validateUser(client);

    const chats = await this.chatService.findForUser(user);
    const chatIds = chats.chats.map((c) => c.chat._id.toString());

    client.join(chatIds);

    this.server.to(chatIds).emit(Events.USER_JOINED, user.userId);

    return chatIds;
  }

  @SubscribeMessage(Events.MESSAGE)
  async messageToRoom(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<Message> {
    const user = await this.validateUser(client);

    const rooms = client.rooms;

    try {
      const message = await this.messageService.create(payload, user);

      this.server.to(Array.from(rooms)).emit(Events.NEW_MESSAGE, message);

      return message;
    } catch (e: any) {
      console.error(
        'error while creating message',
        (e as HttpException).message,
      );
      client.emit(Events.ERROR, (e as HttpException).message);
      throw new WsException((e as HttpException).message);
    }
  }

  private async validateUser(client: Socket) {
    const token =
      client?.handshake?.auth?.token ?? client?.handshake?.headers?.token ?? '';
    const user = await AuthUser.verifyToken(token, {
      baseUrl: process.env.KEYCLOAK_URL || '',
      realm: 'dev',
    });
    if (!user) {
      console.log('user not found', user, token);
      client.emit(Events.USER_NOT_AUTHENTICATED, 'Not authenticated. Bye bye.');
      client.disconnect(true);
      throw new WsException('Not authenticated. Bye bye.');
    }

    return user;
  }
}
