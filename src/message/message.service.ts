import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemata/message.schema';
import { AuthUser, GlobalStatus } from '@nibyou/types';
import { Chat, ChatDocument } from '../chat/schemata/chat.schema';
import { filterDeleted } from '../query-helpers/global.query-helpers';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    user: AuthUser,
  ): Promise<Message> {
    const chat = await this.chatModel.findOne({
      _id: createMessageDto.chat,
      ...filterDeleted,
    });

    if (!chat) {
      throw new HttpException('Chat not found', 400);
    }

    if (!AuthUser.isAdmin(user)) {
      createMessageDto.sender = user.userId;
    }

    if (!chat.members.includes(createMessageDto.sender)) {
      throw new HttpException(
        'The user is not allowed to create a message in this chat',
        403,
      );
    }

    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find();
  }

  async findForChat(chatId: string, user: AuthUser) {
    const chat = await this.chatModel.findOne({
      _id: chatId,
      ...filterDeleted,
    });

    if (!chat) {
      throw new HttpException('Chat not found', 404);
    }

    if (chat.members.includes(user.userId) || AuthUser.isAdmin(user)) {
      return this.messageModel.find({ chat, ...filterDeleted });
    } else {
      throw new HttpException(
        'The user is not allowed to see messages in this chat',
        403,
      );
    }
  }

  async findOne(id: string, user: AuthUser) {
    const message = await this.messageModel.findOne({
      _id: id,
      ...filterDeleted,
    });

    if (!message) {
      throw new HttpException('Message not found', 404);
    }

    const chat = await this.chatModel.findOne({
      _id: message.chat,
      ...filterDeleted,
    });

    if (!chat) {
      throw new HttpException('Chat not found', 404);
    }

    if (AuthUser.isAdmin(user) || chat.members.includes(user.userId)) {
      return message;
    }

    throw new HttpException('You are not allowed to access this chat', 403);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findOneAndUpdate(
      { _id: id, ...filterDeleted },
      updateMessageDto,
    );
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const message = await this.messageModel.findOne({
      _id: id,
      ...filterDeleted,
    });

    if (!message) {
      throw new HttpException('Message not found', 404);
    }

    const chat = await this.chatModel.findOne({
      _id: message.chat,
      ...filterDeleted,
    });

    if (!chat) {
      throw new HttpException('Chat not found', 404);
    }

    if (AuthUser.isAdmin(user) || chat.members.includes(user.userId)) {
      await this.messageModel.findOneAndUpdate(
        { _id: id, ...filterDeleted },
        { status: GlobalStatus.DELETED },
      );
    }

    throw new HttpException('You are not allowed to access this chat', 403);
  }
}
