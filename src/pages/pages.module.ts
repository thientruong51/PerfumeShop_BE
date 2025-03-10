import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PerfumesModule } from '../perfumes/perfumes.module';
import { MembersModule } from 'src/members/members.module';
import { BrandsModule } from 'src/brands/brands.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/commentsModule';

@Module({
  imports: [PerfumesModule,MembersModule,BrandsModule,AuthModule,CommentsModule],
  controllers: [PagesController],
})
export class PagesModule {}
