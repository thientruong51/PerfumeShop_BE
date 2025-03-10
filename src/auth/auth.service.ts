import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import admin from '../config/firebase';
import { Member } from 'src/members/schemas/member.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Member.name) private memberModel: Model<Member>, 
  ) {}

 
  async register(email: string, password: string, name: string, YOB: number, gender: boolean) {
    const existingUser = await this.memberModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.memberModel({ email, password: hashedPassword, name, YOB, gender });
    await newUser.save();
    return { message: 'User registered successfully' };
  }

  
  async login(email: string, password: string) {
    const user = await this.memberModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.isAdmin ? 'admin' : 'member'
    };
    
    return { 
      access_token: this.jwtService.sign(payload),
      user, 
    };
  }
  

  async firebaseAuth(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      let user = await this.memberModel.findOne({ email: decodedToken.email });

      if (!user) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        user = new this.memberModel({
          email: decodedToken.email,
          name: decodedToken.displayName || 'Unknown',
          firebaseUid: decodedToken.uid,
          isAdmin: false,
          password: hashedPassword,
        });
        await user.save();
      }


      const access_token = this.jwtService.sign(
        {
          sub: user._id as string, 
          email: user.email,
          isAdmin: user.isAdmin || false,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '7d',
        },
      );
      

     
      return {
        user: {
          _id: user._id, 
          email: user.email,
          uid: user.firebaseUid,
          isAdmin: user.isAdmin || false,
        },
        access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
  



  async getProfile(userId: string) {
    const user = await this.memberModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }


  async updateProfile(userId: string, updateData: Partial<Member>) {
    return await this.memberModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.memberModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async logout(res: Response) {
    
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });

    console.log(`User logged out and cookies removed`);

    return res.json({ message: 'Logged out successfully' });
}
}
