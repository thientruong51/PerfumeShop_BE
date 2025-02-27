import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
    const payload = { email: user.email, sub: user._id, isAdmin: user.isAdmin };
    return { access_token: this.jwtService.sign(payload) };
  }

  async firebaseAuth(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      let user = await this.memberModel.findOne({ email: decodedToken.email });

      if (!user) {
        
        user = new this.memberModel({
          email: decodedToken.email,
          name: decodedToken.name || 'Unknown',
          firebaseUid: decodedToken.uid,
        });
        await user.save();
      }

      return { email: user.email, uid: user.firebaseUid };
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
}
