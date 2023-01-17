import { Injectable } from '@nestjs/common';
import { GuestMeetingDto, ModMeetingDto } from './dto/jwt.dto';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import { AuthUser } from '@nibyou/types';

@Injectable()
export class EconsultService {
  async getGuestJwt(dto: GuestMeetingDto): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        {
          aud: 'jitsi',
          context: {
            user: {
              name: dto.username,
              email: dto.email,
            },
          },
          iss: process.env.EC_ISS,
          moderator: false,
          room: dto.roomName,
          sub: '*', //process.env.EC_SUB,
        },
        process.env.EC_SECRET,
        {
          expiresIn: '2 days',
        },
        function (err, token) {
          if (err) return reject(err);
          return resolve(token);
        },
      );
    });
  }

  async getModJwt(dto: ModMeetingDto, user: AuthUser) {
    return new Promise((resolve, reject) => {
      sign(
        {
          aud: 'jitsi',
          context: {
            user: {
              name: user.name,
              email: user.email,
            },
          },
          iss: process.env.EC_ISS,
          moderator: true,
          room: dto.roomName,
          sub: process.env.EC_SUB,
        },
        process.env.EC_SECRET,
        {
          expiresIn: '2 days',
        },
        function (err, token) {
          if (err) return reject(err);
          return resolve(token);
        },
      );
    });
  }
}
