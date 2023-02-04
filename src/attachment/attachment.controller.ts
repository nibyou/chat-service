import { Body, Controller, Param, Query } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Attachment } from './schemata/attachment.schema';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import {
  AuthUser,
  CreateRequest,
  DeleteRequest,
  ReadRequest,
  RealmRoles,
  UpdateRequest,
} from '@nibyou/types';
import { S3UrlResponse } from './dto/s3-attachment.dto';

@ApiTags('attachment')
@ApiBearerAuth()
@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @ReadRequest({
    path: 'presigned-s3-url',
    summary: 'Get a presigned S3 URL',
    description: 'The presigned S3 URL has been successfully returned.',
    returnType: S3UrlResponse,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'getPresignedS3Url' })
  getPresignedS3Url(@Query('ext') ext: string) {
    return this.attachmentService.getAttachmentUrl(ext);
  }

  @CreateRequest({
    summary: 'Create a new attachment',
    description: 'The attachment has been successfully created.',
    returnType: Attachment,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'createAttachment' })
  create(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.attachmentService.create(createAttachmentDto, user);
  }

  @ReadRequest({
    summary: 'Get an attachment',
    description: 'The attachments have been successfully returned.',
    returnType: [Attachment],
    roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE],
  })
  @ApiOperation({ operationId: 'getAttachments' })
  findAll(@Query('filter') filter: string) {
    return this.attachmentService.findAll(filter);
  }

  @ReadRequest({
    path: 'message/:messageId',
    summary: 'Get all attachments for a message',
    description: 'The attachments have been successfully returned.',
    returnType: [Attachment],
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'getAttachmentsForMessage' })
  findForMessage(
    @Param('messageId') messageId: string,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.attachmentService.findForMessage(messageId, user);
  }

  @ReadRequest({
    path: 'chat/:chatId',
    summary: 'Get all attachments for a chat',
    description: 'The attachments have been successfully returned.',
    returnType: [Attachment],
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'getAttachementsForChat' })
  findForChat(
    @Param('chatId') chatId: string,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.attachmentService.findForChat(chatId, user);
  }

  @ReadRequest({
    path: ':id',
    summary: 'Get an attachment',
    description: 'The attachment has been successfully returned.',
    returnType: Attachment,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'getAttachment' })
  findOne(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.attachmentService.findOne(id, user);
  }

  @UpdateRequest({
    path: ':id',
    summary: 'Update an attachment',
    description: 'The attachment has been successfully updated.',
    returnType: Attachment,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'updateAttachment' })
  update(
    @Param('id') id: string,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.attachmentService.update(id, updateAttachmentDto, user);
  }

  @DeleteRequest({
    path: ':id',
    summary: 'Delete an attachment',
    description: 'The attachment has been successfully deleted.',
    returnType: null,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  @ApiOperation({ operationId: 'deleteAttachment' })
  remove(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.attachmentService.remove(id, user);
  }
}
