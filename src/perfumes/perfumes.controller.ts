import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PerfumesService } from './perfumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('perfumes')
export class PerfumesController {
  constructor(private readonly perfumesService: PerfumesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createPerfume(@Body() data: any) {
    const perfume = await this.perfumesService.createPerfume(data);
    return {
      message: 'Perfume added successfully!',
      data: perfume,
    };
  }

 
  @Get()
  async getAllPerfumes(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const perfumes = await this.perfumesService.getAllPerfumes(
      Number(page),
      Number(limit),
    );
    return {
      message: 'Get perfume list successfully!',
      data: perfumes,
    };
  }

  
  @Get(':id')
  async getPerfumeById(@Param('id') id: string) {
    const perfume = await this.perfumesService.getPerfumeById(id);
    return {
      message: 'Retrieved perfume details successfully!',
      data: perfume,
    };
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updatePerfume(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    const updatedPerfume = await this.perfumesService.updatePerfume(
      id,
      updateData,
    );

    return {
      message:'Perfume update successful!',
      data: updatedPerfume,
    };
  }

 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deletePerfume(@Param('id') id: string) {
    await this.perfumesService.deletePerfume(id);
    return {
      message: 'Perfume removed successfully!',
    };
  }

  

}
