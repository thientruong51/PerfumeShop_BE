import { Controller, Post, Body, Req, Res, Session, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 

  @Post('/register')
  async register(
    @Res() res: Response,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('YOB') YOB: number,
    @Body('gender') gender: boolean,
  ) {
    try {
      await this.authService.register(email, password, name, YOB, gender);
      return res.redirect('/login');
    } catch (error) {
      return res.render('register', { error: error.message }); 
    }
  }
  
  @Post('/login')
async login(
  @Body('email') email: string,
  @Body('password') password: string,
  @Res() res: Response,
  @Session() session: Record<string, any>
) {
  try {
    const { user, access_token } = await this.authService.login(email, password);

    if (!user || !access_token) {
      throw new Error('Wrong email or password.');
    }


    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

   
    session.user = user;

   
    return res.redirect(user.isAdmin ? '/dashboard' : '/');

  } catch (error: any) {
    console.error(' Login error:', error.message);
    return res.redirect('/login?error=Invalid%20credentials');
  }
}

  


@Post('/firebase-login')
async firebaseLogin(
  @Body('idToken') idToken: string,
  @Res({ passthrough: true }) res: Response,
  @Session() session: Record<string, any>
) {
  try {
    const { user, access_token } = await this.authService.firebaseAuth(idToken);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    session.user = user;
    return res.status(200).json({
      message: 'Firebase login successful',
      access_token,
      user,
    });
  } catch (error) {
    console.error('Firebase Login Error:', error.message);
    throw new UnauthorizedException('Invalid Firebase token');
  }
}

@UseGuards(JwtAuthGuard)
@Post('/logout')
async logout(@Req() req: Request, @Res() res: Response) {
    const member = req.user as { _id: string };

    if (!member) {
        return res.status(400).json({ message: 'Member not found' });
    }

   
    const session = req.session as any; 

    if (session && typeof session.destroy === 'function') {
        session.destroy((err) => {
            if (err) {
                console.error('Error when canceling session:', err);
            }
        });
    }

    
    res.clearCookie('connect.sid', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });

    console.log(`Member ${member._id} logged out`);
    return res.redirect('/login');
}



}
