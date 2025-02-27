import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post() async createBrand(@Body('brandName') brandName: string) {
    return this.brandsService.createBrand(brandName);
  }

  @Get() async getAllBrands() {
    return this.brandsService.getAllBrands();
  }

  @Patch(':id') async updateBrand(@Param('id') id: string, @Body('brandName') brandName: string) {
    return this.brandsService.updateBrand(id, brandName);
  }

  @Delete(':id') async deleteBrand(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
