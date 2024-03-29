import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { AuthUser, RealmRoles } from '@nibyou/types';
import { Chat } from './schemata/chat.schema';
import {
  ChatsWithLastMessageAndUserInfoDto,
  ChatsWithLastMessagesDto,
} from './dto/get-chat.dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat', operationId: 'createChat' })
  @ApiCreatedResponse({
    description: 'The chat has been successfully created.',
    type: Chat,
  })
  @ApiBadRequestResponse({
    description: 'The members array must contain at least your user id.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.USER_PRACTITIONER,
    ],
  })
  create(
    @Body() createChatDto: CreateChatDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.chatService.create(createChatDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats', operationId: 'getChats' })
  @ApiOkResponse({
    description: 'The list of chats has been successfully returned.',
    type: [Chat],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE],
  })
  findAll() {
    return this.chatService.findAll();
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get all chats for the current user',
    operationId: 'getChatsForCurrentUser',
  })
  @ApiOkResponse({
    description: 'The list of chats has been successfully returned.',
    type: ChatsWithLastMessagesDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.ADMIN,
    ],
  })
  findForUser(@AuthenticatedUser() user: AuthUser) {
    return this.chatService.findForUser(user);
  }

  @Get('/me/withProfileInfo')
  @ApiOperation({
    summary: 'Get all chats for the current user with profile info of members',
    operationId: 'getChatsForCurrentUserWithProfileInfo',
  })
  @ApiOkResponse({
    description: 'The list of chats has been successfully returned.',
    type: ChatsWithLastMessageAndUserInfoDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.ADMIN,
    ],
  })
  findForUserWithProfileInfo(@AuthenticatedUser() user: AuthUser) {
    return this.chatService.findForUserWithProfileInfo(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat by id', operationId: 'getChatById' })
  @ApiOkResponse({
    description: 'The chat has been successfully returned.',
    type: Chat,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
    ],
  })
  findOne(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.chatService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chat', operationId: 'updateChat' })
  @ApiOkResponse({
    description: 'The chat has been successfully updated.',
    type: Chat,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
    ],
  })
  update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.chatService.update(id, updateChatDto, user);
  }

  @Post(':id/markRead')
  @ApiOperation({
    summary: 'Mark a Chat as read',
    operationId: 'markChatRead',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
    ],
  })
  markRead(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.chatService.markRead(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat', operationId: 'deleteChat' })
  @ApiOkResponse({
    description: 'The chat has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE] })
  remove(@Param('id') id: string): Promise<void> {
    return this.chatService.remove(id);
  }

  @Delete(':id/me')
  @ApiOperation({
    summary: 'Remove the current user from a chat',
    operationId: 'removeCurrentUserFromChat',
  })
  @ApiOkResponse({
    description:
      'The current user has been successfully removed from the chat.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [RealmRoles.USER_PRACTITIONER, RealmRoles.USER_PATIENT],
  })
  removeMember(
    @Param('id') id: string,
    @AuthenticatedUser() user: AuthUser,
  ): Promise<void> {
    return this.chatService.removeMember(id, user);
  }
}
