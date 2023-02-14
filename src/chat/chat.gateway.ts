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

export enum Events {
  USER_JOINED = 'USER_JOINED',
  USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED',
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
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  async joinChatRooms(client: Socket): Promise<string[]> {
    const user = await AuthUser.verifyToken(
      client?.handshake?.auth?.token ?? '',
      {
        baseUrl: process.env.KEYCLOAK_URL || '',
        realm: 'dev',
      },
    );

    console.log(user);

    if (!user) {
      console.log('user not found');
      client.emit(Events.USER_NOT_AUTHENTICATED, 'Not authenticated. Bye bye.');
      client.disconnect(true);
      throw new WsException('Not authenticated. Bye bye.');
    }

    const chats = await this.chatService.findForUser(user);
    const chatIds = chats.chats.map((c) => c.chat._id);

    client.join(chatIds);

    this.server.to(chatIds).emit(Events.USER_JOINED, user.userId);

    return chatIds;
  }

  @SubscribeMessage('message')
  async messageToRoom(client: Socket, payload: any): Promise<string> {
    console.log(client, payload);
    return 'message';
  }
}
