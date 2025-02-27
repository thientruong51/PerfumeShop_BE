import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersModule } from 'src/members/members.module'; 
import { Member, MemberSchema } from 'src/members/schemas/member.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]), 
    MembersModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard], 
  exports: [AuthService, JwtAuthGuard], 
})
export class AuthModule {}
