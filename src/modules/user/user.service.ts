import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(createUserDto: CreateUserDto, session: ClientSession) {
        const createdUser = await this.userRepository.create(createUserDto, session);
        return createdUser;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        return await this.userRepository.getUserById(id);
    }
    async get(getQueryDto: GetQueryDto) {
        return await this.userRepository.get(getQueryDto);
    }

    async delete(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.delete(updateUserDto, session);
    }

    async update(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.update(updateUserDto, session);
    }

    async resetpassword(updatePasswordDto: UpdatePasswordDto) {
        return await this.userRepository.resetpassword(updatePasswordDto);
    }

}
