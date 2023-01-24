import { HttpException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemata/chat.schema';
import { Model } from 'mongoose';
import { AuthUser, GlobalStatus } from '@nibyou/types';
import { filterDeleted } from '../query-helpers/global.query-helpers';
import {
  ChatsWithLastMessageAndUserInfoDto,
  ChatsWithLastMessagesDto,
  ChatWithLastMessage,
  ChatWithLastMessageAndUserInfo,
} from './dto/get-chat.dto';
import { Message, MessageDocument } from '../message/schemata/message.schema';
import { v4 } from 'uuid';
import { PractitionersApi, ProfilesApi, UsersApi } from '../generated';
import { Practitioner, Profile } from '../generated/profile';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(createChatDto: CreateChatDto, user: AuthUser): Promise<Chat> {
    //TODO: check if user is allowed to create a chat with the given users in createChatDto.members
    if (createChatDto.members.length === 0) {
      throw new HttpException('At least one member must be specified', 400);
    }

    if (!AuthUser.isAdmin(user)) {
      if (!createChatDto.members.includes(user.userId)) {
        throw new HttpException(
          'You are not allowed to create a chat with yourself',
          400,
        );
      }
      if (createChatDto.admin && createChatDto.admin !== user.userId) {
        throw new HttpException(
          'You are not allowed to create a chat with another user as admin',
          400,
        );
      }
    }

    if (createChatDto.members.length > 2 && !createChatDto.admin) {
      // group chat
      createChatDto.admin = user.userId;
      if (!createChatDto.name) {
        createChatDto.name = `New group chat`;
      }
    }

    const chat = {
      ...createChatDto,
      keyId: v4(),
    };

    return this.chatModel.create(chat);
  }

  findAll() {
    return this.chatModel.find();
  }

  async findForUser(user: AuthUser): Promise<ChatsWithLastMessagesDto> {
    const chats = await this.chatModel
      .find({
        members: user.userId,
        ...filterDeleted,
      })
      .sort({ lastMessageAt: -1 });

    const chatsWithMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await this.messageModel
          .findOne({ chats: chat._id, ...filterDeleted })
          .sort({ createdAt: -1 });
        return {
          chat,
          lastMessage,
        } as ChatWithLastMessage;
      }),
    );

    return {
      chats: chatsWithMessage,
    };
  }

  async findForUserWithProfileInfo(
    user: AuthUser,
  ): Promise<ChatsWithLastMessageAndUserInfoDto> {
    const chats = await this.chatModel
      .find({
        members: user.userId,
        ...filterDeleted,
      })
      .sort({ lastMessageAt: -1 });
    try {
      const chatsWithMessage = await Promise.all(
        chats.map(async (chat) => {
          const lastMessage = await this.messageModel
            .findOne({ chats: chat._id, ...filterDeleted })
            .sort({ createdAt: -1 });
          const users = await Promise.all(
            chat.members.map(async (member) => {
              const userRes = await UsersApi.usersControllerFindOne(member);
              const user = userRes.data;
              let profile: Profile | Practitioner = null;
              if (user.profiles.length != 0) {
                profile = (
                  await ProfilesApi.profileControllerFindOne(user.profiles[0])
                ).data;
              } else if (user.practitioners.length != 0) {
                profile = (
                  await PractitionersApi.practitionerControllerFindOne(
                    user.practitioners[0],
                  )
                ).data;
              }
              return {
                user,
                profile,
              };
            }),
          );

          return {
            chat,
            lastMessage,
            users: users.map((u) => {
              return {
                userId: u.user._id,
                firstName: u.user.firstName,
                lastName: u.user.lastName,
                profileImage: u.profile ? u.profile.profileImage : '',
              };
            }),
          } as ChatWithLastMessageAndUserInfo;
        }),
      );

      return {
        chats: chatsWithMessage,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, 500);
    }
  }

  async findOne(id: string, user: AuthUser) {
    const chat = await this.chatModel.findOne({ _id: id, ...filterDeleted });
    if (!chat) {
      throw new HttpException('Chat not found', 404);
    }

    if (!AuthUser.isAdmin(user)) {
      if (!chat.members.includes(user.userId)) {
        throw new HttpException('You are not allowed to access this chat', 400);
      }
    }

    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto, user: AuthUser) {
    const chat = await this.chatModel.findOne({ _id: id, ...filterDeleted });

    if (chat.admin) {
      if (!AuthUser.isAdmin(user) || chat.admin !== user.userId) {
        throw new HttpException('You are not allowed to update this chat', 400);
      }
    }

    return this.chatModel.findOneAndUpdate(
      { _id: id, ...filterDeleted },
      updateChatDto,
      { new: true },
    );
  }

  async remove(id: string): Promise<void> {
    await this.chatModel.findOneAndUpdate(
      { _id: id, ...filterDeleted },
      { status: GlobalStatus.DELETED },
    );
  }

  async removeMember(id: string, user: AuthUser): Promise<void> {
    const chat = await this.chatModel.findOne({ _id: id, ...filterDeleted });
    if (!chat) {
      throw new HttpException('Chat not found', 404);
    }

    if (!chat.members.includes(user.userId)) {
      throw new HttpException('You are not allowed to access this chat', 400);
    }

    chat.members = chat.members.filter((member) => member !== user.userId);
    await this.chatModel.findOneAndUpdate(
      { _id: id, ...filterDeleted },
      { members: chat.members },
    );
  }
}
