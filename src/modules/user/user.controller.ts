import { BadRequestException, Body, Controller, Get, HttpStatus, Query, Param, Post, Res, Put, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userService: UserService) { }

    @Post('/createUser')
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newUser: any = await this.userService.create(createUserDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.CREATED).send(newUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }


    @Get('/getUserById/:id')
    async getUserById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const user: any = await this.userService.getUserById(id);
        return res.status(HttpStatus.OK).send(user);
    }

    @Get('/getUsers')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.userService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }


    @Put('/deleteUsers/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateUserDto.id = id;
        try {
            const deleteUser: any = await this.userService.delete(updateUserDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(deleteUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updateuser/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateUserDto.id = id;
        try {
            const deleteUser: any = await this.userService.update(updateUserDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(deleteUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('resetpassword/:id')
    async resetpassword(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updatePasswordDto: UpdatePasswordDto, @Req() req: any, @Res() res: Response) {
        updatePasswordDto.id = id;
        const user: any = await this.userService.resetpassword(updatePasswordDto);
        return res.status(HttpStatus.OK).send(user);
    }

}
