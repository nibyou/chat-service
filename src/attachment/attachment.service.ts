import { HttpException, Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Attachment } from './schemata/attachment.schema';
import { Model } from 'mongoose';
import { Chat } from '../chat/schemata/chat.schema';
import { Message } from '../message/schemata/message.schema';
import { ChatService } from '../chat/chat.service';
import { AuthUser, GlobalStatus } from '@nibyou/types';
import { filterDeleted } from '../query-helpers/global.query-helpers';
import { Client } from 'minio';
import { v4 as uuid } from 'uuid';
import { S3UrlResponse } from './dto/s3-attachment.dto';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel('Attachment')
    private readonly attachmentModel: Model<Attachment>,
    @InjectModel('Chat')
    private readonly chatModel: Model<Chat>,
    @InjectModel('Message')
    private readonly messageModel: Model<Message>,
    private readonly chatService: ChatService,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto, user: AuthUser) {
    const chat = await this.getChat(user, createAttachmentDto.chatId);

    // chat exists and user is allowed to create a message in this chat
    delete createAttachmentDto.chatId;

    const payload = {
      ...createAttachmentDto,
      chat: chat._id,
    };

    const attachment = new this.attachmentModel(payload);
    return attachment.save();
  }

  findAll(f?: string) {
    try {
      const filter = JSON.parse(f);
      return this.attachmentModel.find(filter);
    } catch (e) {
      return this.attachmentModel.find();
    }
  }

  async findForMessage(messageId: string, user: AuthUser) {
    const message = await this.messageModel
      .findOne({ _id: messageId, ...filterDeleted })
      .populate('attachments');

    await this.getChat(user, message.chat.toString());

    return message.attachments;
  }

  async findOne(id: string, user: AuthUser) {
    const attachment = await this.attachmentModel.findOne({
      _id: id,
      ...filterDeleted,
    });

    await this.getChat(user, attachment.chat.toString());

    return attachment;
  }

  async update(
    id: string,
    updateAttachmentDto: UpdateAttachmentDto,
    user: AuthUser,
  ) {
    const { chatId, ...payload } = updateAttachmentDto;
    await this.getChat(user, chatId);
    return this.attachmentModel.findOneAndUpdate(
      { _id: id, ...filterDeleted },
      payload,
      {
        new: true,
      },
    );
  }

  async remove(id: string, user: AuthUser) {
    const { _id } = await this.findOne(id, user);
    await this.attachmentModel.updateOne(
      { _id },
      { status: GlobalStatus.DELETED },
    );
  }

  async getAttachmentUrl(ext: string) {
    const minioClient = new Client({
      endPoint: process.env.S3_BASE_URL,
      port: parseInt(process.env.S3_PORT),
      useSSL: true,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    });

    const uid = uuid();

    const upload = await minioClient.presignedPutObject(
      process.env.S3_BUCKET,
      `${uid}.${ext}`,
      60,
    );

    return {
      upload,
      download: `https://${process.env.S3_BASE_URL}/${process.env.S3_BUCKET}/${uid}.${ext}`,
    } as S3UrlResponse;
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
