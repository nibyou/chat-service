import { Body, Controller, Param, Query } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  getPresignedS3Url(@Query('ext') ext: string) {
    return this.attachmentService.getAttachmentUrl(ext);
  }

  @CreateRequest({
    summary: 'Create a new attachment',
    description: 'The attachment has been successfully created.',
    returnType: Attachment,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
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
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  findForMessage(
    @Param('messageId') messageId: string,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.attachmentService.findForMessage(messageId, user);
  }

  @ReadRequest({
    path: ':id',
    summary: 'Get an attachment',
    description: 'The attachment has been successfully returned.',
    returnType: Attachment,
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
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
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
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
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  remove(@Param('id') id: string, @AuthenticatedUser() user: AuthUser) {
    return this.attachmentService.remove(id, user);
  }
}
