import { HttpException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemata/message.schema';
import { AuthUser, GlobalStatus } from '@nibyou/types';
import { Chat, ChatDocument } from '../chat/schemata/chat.schema';
import { filterDeleted } from '../query-helpers/global.query-helpers';
import { AttachmentService } from '../attachment/attachment.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly attachmentService: AttachmentService,
    private readonly chatService: ChatService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    user: AuthUser,
  ): Promise<Message> {
    const chat = await this.getChat(user, createMessageDto.chat);

    const sender = AuthUser.isAdmin(user)
      ? createMessageDto.sender || user.userId
      : user.userId;

    let attachments: string[];
    if (createMessageDto.attachments?.length > 0) {
      attachments = (await Promise.all(
        createMessageDto.attachments.map(async (attachment) => {
          const attachmentModel = await this.attachmentService.create(
            {
              ...attachment,
              fileType: attachment.fileType || '',
              chatId: chat._id,
            },
            user,
          );
          return attachmentModel._id;
        }),
      )) as string[];
    }

    if (attachments) {
      delete createMessageDto.attachments;
    }

    delete createMessageDto.chat;
    const message: Partial<MessageDocument> = {
      message: createMessageDto.message,
      attachments: attachments as any[],
      sender,
      chats: [chat._id],
    };
    await this.chatModel.updateOne(
      { _id: chat._id },
      { $currentDate: { lastMessageAt: true } },
    );

    const chatM = await this.messageModel.create(message);
    console.log(chatM);
    return chatM;
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find();
  }

  async findForChat(
    chatId: string,
    user: AuthUser,
    limit: number,
    skip: number,
  ) {
    const chat = await this.getChat(user, chatId);
    console.log(chat);
    return this.messageModel
      .find({ chats: chat._id, ...filterDeleted })
      .skip(skip)
      .limit(limit)
      .populate(['attachments']);
  }

  async findOne(id: string, user: AuthUser) {
    const message = await this.messageModel
      .findOne({
        _id: id,
        ...filterDeleted,
      })
      .populate(['attachments', 'chats', 'chat']);

    if (!message) {
      throw new HttpException('Message not found', 404);
    }

    const chat = await this.chatModel.findOne({
      _id: message.chats[0],
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
      { new: true },
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
      _id: message.chats[0],
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

  private async getChat(user: AuthUser, chatId: string) {
    const chat = await this.chatService.findOne(chatId, user).catch(() => {
      throw new HttpException('Chat not found', 400);
    });

    if (!chat) {
      throw new HttpException('Chat not found', 400);
    }

    if (!AuthUser.isAdmin(user)) {
      if (!chat.members.includes(user.userId)) {
        throw new HttpException(
          'The user is not allowed to interact with this chat',
          403,
        );
      }
    }

    return chat;
  }
}
