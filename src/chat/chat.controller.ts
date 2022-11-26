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
import { ChatsWithLastMessagesDto } from './dto/get-chat.dto';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
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
  @ApiOperation({ summary: 'Get all chats' })
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
  @ApiOperation({ summary: 'Get all chats for the current user' })
  @ApiOkResponse({
    description: 'The list of chats has been successfully returned.',
    type: ChatsWithLastMessagesDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [RealmRoles.USER_PRACTITIONER, RealmRoles.USER_PATIENT],
  })
  findForUser(@AuthenticatedUser() user: AuthUser) {
    return this.chatService.findForUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat by id' })
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
  @ApiOperation({ summary: 'Update a chat' })
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
    ],
  })
  update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.chatService.update(id, updateChatDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiOkResponse({
    description: 'The chat has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE] })
  remove(@Param('id') id: string): Promise<void> {
    return this.chatService.remove(id);
  }

  @Delete(':id/me')
  @ApiOperation({ summary: 'Remove the current user from a chat' })
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
