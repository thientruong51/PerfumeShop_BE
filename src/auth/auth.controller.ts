import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('YOB') YOB: number,
    @Body('gender') gender: boolean,
  ) {
    return this.authService.register(email, password, name, YOB, gender);
  }

 
  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  
  @Post('firebase-login')
  async firebaseLogin(@Body('idToken') idToken: string) {
    return this.authService.firebaseAuth(idToken);
  }
}
