import { ForbiddenException, Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from 'src/repositories/user.repository';
import { ChangePasswordDto, LoginDto, RegisterDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '../user/dto/updateUser.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private configService: ConfigService) {}

    async registerAccount(createUserDto: RegisterDTO, session: ClientSession) {
        const createdUser = await this.userRepository.registerAccount(createUserDto, session);
        // delete createdUser.password;
        return createdUser;
    }

    async login(loginDto: LoginDto, session: ClientSession): Promise<any> {
        const user = await this.userRepository.validateUser(loginDto, session);
        
        user.refreshToken = '';
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        return await this.userRepository.getUserById(id);
    }

    async changepassword(updatePasswordDto: ChangePasswordDto, session: ClientSession) {
        return await this.userRepository.changepassword(updatePasswordDto, session);
    }
    async updateusername(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.updateusername(updateUserDto, session);
    }
    async updateemail(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.updateemail(updateUserDto, session);
    }
    async refreshTokens(userId: MongooseSchema.Types.ObjectId, refreshToken: string) {
        const user = await this.userRepository.getUserById(userId);
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied token not available');
        if (user.refreshToken !== refreshToken) throw new ForbiddenException('Access Denied token not match');
        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }


    async getTokens(user: any) {
        const userId = {userId:user.id, name:user.neme};
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    user,
                },
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: '1d',
                },
            ),
            this.jwtService.signAsync(
                {
                    userId,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId: MongooseSchema.Types.ObjectId, refreshToken: string) {
        await this.userRepository.updaterefreshToken(userId, refreshToken);
    }
}
