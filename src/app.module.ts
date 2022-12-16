import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from '@nibyou/keycloak';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { WssModule } from './wss/wss.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AttachmentModule } from './attachment/attachment.module';
import { EconsultModule } from './econsult/econsult.module';

const mongoOptions: MongooseModuleOptions = {
  user: process.env.MONGO_USER || '',
  pass: process.env.MONGO_PASS || '',
  useNewUrlParser: true,
  dbName: process.env.MONGO_DB || '',
};

@Module({
  imports: [
    KeycloakModule,
    ChatModule,
    MessageModule,
    WssModule,
    MongooseModule.forRoot(process.env.MONGO_URL, mongoOptions),
    AttachmentModule,
    EconsultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
