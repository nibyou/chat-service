import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Message } from './schemata/message.schema';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { AuthUser, RealmRoles } from '@nibyou/types';
import { PaginationQueryDto } from './dto/get-message.dto';

@ApiTags('message')
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new message',
    operationId: 'createMessage',
  })
  @ApiCreatedResponse({
    description: 'The message has been successfully created.',
    type: Message,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  create(
    @Body() createMessageDto: CreateMessageDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.messageService.create(createMessageDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages', operationId: 'getAllMessages' })
  @ApiOkResponse({
    description: 'The messages have been successfully returned.',
    type: [Message],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE],
  })
  findAll() {
    return this.messageService.findAll();
  }

  @Get('/chat/:chatId')
  @ApiOperation({
    summary: 'Get all messages for a given chat',
    operationId: 'getAllMessagesForChat',
  })
  @ApiOkResponse({
    description: 'The messages have been successfully deleted.',
    type: [Message],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  findForChat(
    @Param('chatId') chatId: string,
    @AuthenticatedUser() user: AuthUser,
    @Query() { skip, limit, start }: PaginationQueryDto,
  ) {
    return this.messageService.findForChat(chatId, user, limit, skip, start);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a message by id',
    operationId: 'getMessageById',
  })
  @ApiOkResponse({
    description: 'The message has been successfully returned.',
    type: Message,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  findOne(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.messageService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a message', operationId: 'updateMessage' })
  @ApiOkResponse({
    description: 'The message has been successfully updated.',
    type: Message,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [RealmRoles.BACKEND_SERVICE, RealmRoles.ADMIN],
  })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message', operationId: 'deleteMessage' })
  @ApiOkResponse({
    description: 'The message has been successfully deleted.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  async remove(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    await this.messageService.remove(id, user);
  }

  @Get('unread/:chatId')
  @ApiOperation({
    summary: 'Get unread message count for a Chat',
    operationId: 'getUnreadCount',
  })
  @ApiOkResponse({
    description: 'The count of unread messages for the Chat has been returned.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  getUnreadCount(
    @Param('chatId') chatId: string,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.messageService.getUnreadCount(chatId, user);
  }
}
