import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User, Token } from './decorators';
import { CurrenteUser } from './interfaces/current-user.interface';


@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,

  ) {}

  @Post('register')
  registerUser( @Body() registerUserDto: RegisterUserDto){
    return this.authClient.send({cmd:'auth.register.user'}, registerUserDto)
    .pipe(
      catchError( error =>{
        throw new RpcException(error);
      })
    )
  }


  @Post('login')
  loginUser( @Body() loginUserDto: LoginUserDto){
    console.log(loginUserDto);
    return this.authClient.send({cmd:'auth.login.user'}, loginUserDto)
    .pipe(
      catchError((error)=>{
        throw new RpcException(error);
      })
    )
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user:CurrenteUser, @Token() token:string){
    return {
      user,
      token
    };
    //
    // return this.authClient.send({cmd:'auth.verify.user'}, {});
  }
}
