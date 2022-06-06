import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Attachment } from './schemata/attachment.schema';
import { Roles } from 'nest-keycloak-connect';
import { RealmRoles } from '@nibyou/types';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attachment' })
  @ApiCreatedResponse({
    description: 'The attachment has been successfully created.',
    type: Attachment,
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
  create(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentService.create(createAttachmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments' })
  @ApiOkResponse({
    description: 'The attachments have been successfully returned.',
    type: [Attachment],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.BACKEND_SERVICE] })
  findAll() {
    return this.attachmentService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments for a message' })
  @ApiOkResponse({
    description: 'The attachments have been successfully returned.',
    type: [Attachment],
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
  findForMessage(@Param('messageId') messageId: string) {
    return this.attachmentService.findForMessage(messageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
  ) {
    return this.attachmentService.update(+id, updateAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachmentService.remove(+id);
  }
}
