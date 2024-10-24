import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    ])],
    controllers: [UserController],
    providers: [UserService, UserRepository, JwtGuard, JwtStrategy],
    exports: [UserService, UserRepository],
})
export class UserModule { }
