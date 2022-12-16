import { Body, Controller } from '@nestjs/common';
import { EconsultService } from './econsult.service';
import { AuthUser, CreateRequest, RealmRoles } from '@nibyou/types';
import { GuestMeetingDto, JwtDto, ModMeetingDto } from './dto/jwt.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';

@ApiTags('econsult')
@Controller('econsult')
export class EconsultController {
  constructor(private readonly econsultService: EconsultService) {}

  @CreateRequest({
    path: 'guest-jwt',
    roles: false,
    description: 'Get a JWT for a guest (non-moderator)',
    returnType: JwtDto,
  })
  @ApiOperation({ operationId: 'guestJwt' })
  async getGuestJwt(@Body() guestMeetingDto: GuestMeetingDto) {
    return {
      jwt: await this.econsultService.getGuestJwt(guestMeetingDto),
    };
  }

  @CreateRequest({
    path: 'mod-jwt',
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
    description: 'Get a JWT for a logged in user',
    returnType: JwtDto,
  })
  @ApiOperation({ operationId: 'modJwt' })
  async getModJwt(
    @Body() modMeetingDto: ModMeetingDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return {
      jwt: await this.econsultService.getModJwt(modMeetingDto, user),
    };
  }
}
