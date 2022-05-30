import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from '@nibyou/keycloak';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { WssModule } from './wss/wss.module';

@Module({
  imports: [KeycloakModule, ChatModule, MessageModule, WssModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
