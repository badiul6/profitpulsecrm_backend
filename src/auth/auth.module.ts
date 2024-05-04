import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer';
import { LocalStrategy } from './strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemporaryPassword,
  TemporaryPasswordSchema,
  User,
  UserSchema,
} from './schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TemporaryPassword.name, schema: TemporaryPasswordSchema },
    ]),
    PassportModule.register({ session: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          ignoreTLS: true,
          auth: {
            user: configService.get('GMAIL_USER'),
            pass: configService.get('PASSWORD'),
          },
        },
        defaults: {
          from: `ProfitPulse CRM <${configService.get('GMAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [AuthService, SessionSerializer, LocalStrategy],
  controllers: [AuthController],
  exports: [MongooseModule, AuthService],
})
export class AuthModule {}
