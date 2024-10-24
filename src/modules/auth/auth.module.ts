import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { RefreshTokenStrategy } from './guards/refreshToken.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }, 
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository, JwtStrategy, RefreshTokenStrategy, ConfigService],
    exports: [AuthService, UserRepository],
})
export class AuthModule {}
