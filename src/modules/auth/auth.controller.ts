import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ClientSession, Connection, Schema as MongooseSchema } from 'mongoose';
import { UpdateUserDto } from '../user/dto/updateUser.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RefereshTokenDto, RegisterDTO } from './dto/auth.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refreshToken.gaurd';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private authService: AuthService) {}

    @Post('register')
    async register(@Body() userDTO: RegisterDTO, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newCategory: any = await this.authService.registerAccount(userDTO, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Post('login')
    async login(@Body() userDTO: LoginDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const jwttoken: any = await this.authService.login(userDTO, session);
            
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send({ token: jwttoken.accessToken, refreshtoken: jwttoken.refreshToken });
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @UseGuards(JwtGuard)
    @Get('getuser')
    async getuser(@Req() req: any, @Res() res: Response) {
        const user: any = await this.authService.getUserById(req.user.id);
        return res.status(HttpStatus.OK).send(user);
    }

    @UseGuards(JwtGuard)
    @Get('getlogininfo')
    async getlogininfo(@Req() req: any, @Res() res: Response) {
        const user: any = await this.authService.getUserById(req.user.id);
        return res.status(HttpStatus.OK).send({ user: user });
    }

    @UseGuards(JwtGuard)
    @Put('changepassword')
    async changepassword(@Body() changePasswordDto: ChangePasswordDto, session: ClientSession, @Req() req: any, @Res() res: Response) {
        changePasswordDto.id = req.user.id;
        const user: any = await this.authService.changepassword(changePasswordDto, session);
        return res.status(HttpStatus.OK).send(user);
    }
    @UseGuards(JwtGuard)
    @Put('updateusername/:id')
    async updateusername(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserDto: UpdateUserDto, session: ClientSession, @Req() req: any, @Res() res: Response) {
        updateUserDto.id = id;
        const user: any = await this.authService.updateusername(updateUserDto, session);
        return res.status(HttpStatus.OK).send(user);
    }
    @UseGuards(JwtGuard)
    @Put('updateemail/:id')
    async updateemail(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserDto: UpdateUserDto, session: ClientSession, @Req() req: any, @Res() res: Response) {
        updateUserDto.id = id;
        const user: any = await this.authService.updateemail(updateUserDto, session);
        return res.status(HttpStatus.OK).send(user);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refreshTokens(@Req() req: any, @Res() res: Response) {
        const userId1 = req.userId;
        const userId = req.user.userId;
        const refreshToken = req.body.refreshToken;
        const jwttoken: any = await this.authService.refreshTokens(userId, refreshToken);
        console.log('jwttoken', jwttoken.refreshToken);
        return res.status(HttpStatus.OK).send({ token: jwttoken.accessToken, refreshtoken: jwttoken.refreshToken });
    }
}
