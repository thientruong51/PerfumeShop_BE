import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createBrand(@Body() createData: any) {
    return this.brandsService.createBrand(createData);
  }

  @Get()
  async getAllBrands() {
    return this.brandsService.getAllBrands();
  }

  @Get(':id')
  async getBrandById(@Param('id') id: string) {
    return this.brandsService.getBrandById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateBrand(@Param('id') id: string, @Body() updateData: any) {
    return this.brandsService.updateBrand(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
