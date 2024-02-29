  import { Module } from '@nestjs/common';
  import { AuthModule } from './auth/auth.module';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { ProfileModule } from './profile/profile.module';
  import { MongooseModule } from '@nestjs/mongoose';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('DATABASE_URL'),
        }),
        inject: [ConfigService],
      }),
      AuthModule,
      ProfileModule],
       })
  export class AppModule {}