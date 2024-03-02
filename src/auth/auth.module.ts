import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './serializer';
import { LocalStrategy } from './strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  PassportModule.register({ session: true }),
  
],
  providers: [AuthService, SessionSerializer, LocalStrategy],
  controllers: [AuthController],
  exports:[MongooseModule, AuthService]
})
export class AuthModule { }
