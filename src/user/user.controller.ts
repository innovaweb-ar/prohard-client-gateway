import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, envs, STORAGE_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MultipartJsonInterceptor } from 'src/common/interceptors/multipart-json.interceptor';
import { firstValueFrom } from 'rxjs';
import { memoryStorage } from 'multer';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrenteUser } from 'src/auth/interfaces/current-user.interface';
import { User } from 'src/auth/decorators';

@Controller('user')
export class UserController {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(STORAGE_SERVICE) private readonly storageService: ClientProxy
  ) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatarUrl', maxCount: 1 }], { storage: memoryStorage() }),
    MultipartJsonInterceptor
  )
  async createUser(@Body() createUserDto: CreateUserDto, @UploadedFiles() files: { avatarUrl?: Express.Multer.File[] }) {

    const user = await firstValueFrom(
      this.authService.send('createUser', createUserDto)
    );

    //2. Si hay archivo, subimos
    if (files.avatarUrl?.length) {
      const file = files.avatarUrl[0];
      const upload = await firstValueFrom(
        this.storageService.send({ cmd: 'storage.upload' }, {
          file: {
            buffer: file.buffer.toString('base64'),
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
          },
          metadata: {
            module: 'user', entityId: user.id, uploadedBy: user.id,
            description: 'Avatar usuario'
          }
        })
      );

      // 3) Actualiza URL en el microservicio de auth
      await firstValueFrom(
        this.authService.send('updateUser', {
          id: user.id,
          avatarUrl: upload.url
        })
      );
      user.avatarUrl = upload.url;
    }
    return user;
  }

  @Get()
  async findAllUser() {
    const users = await firstValueFrom(
      this.authService.send<UserDto[]>('findAllUser', {})
    );


    return users.map(user => {
      if (user.profile.avatarUrl) {
        user.profile.avatarUrl = `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}${user.profile.avatarUrl}`;
      }
      return user;
    });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@User() user: CurrenteUser) {
    const data = await firstValueFrom(
      this.authService.send('auth.getMe', { userId: user.id })
    );

    if(data){
      data.avatarUrl = `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}${data.avatarUrl}`;
      console.log(data.avatarUrl);
    }
    return { data };
  }



  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const user = await firstValueFrom(this.authService.send<UserDto>('findOneUser', id));

    if (user.profile.avatarUrl) {
      user.profile.avatarUrl = `http://${envs.storageMicroserviceHost}:${envs.portStorageHttp}${user.profile.avatarUrl}`;
    }

    return user;
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto) {
    return this.authService.send({ cmd: 'updateUser' }, { id, ...updateUserDto });
  }

}
