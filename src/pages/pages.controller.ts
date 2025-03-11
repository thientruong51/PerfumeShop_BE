import {
  Controller,
  Get,
  Render,
  Req,
  Param,
  Query,
  Body,
  Post,
  Delete,
  Put,
  UseGuards,
  Res,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PerfumesService } from '../perfumes/perfumes.service';
import { Request } from 'express';
import { BrandsService } from 'src/brands/brands.service';
import { MembersService } from 'src/members/members.service';
import { Member } from 'src/members/schemas/member.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { CommentsService } from 'src/comments/commentsService';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class PagesController {
  constructor(
    private readonly perfumesService: PerfumesService,
    private readonly membersService: MembersService,
    private readonly brandsService: BrandsService,
    private readonly authService: AuthService,
    private readonly commentsService: CommentsService
  ) {}

  /** ========== PAGES ========== */
  @Get("/")
  @Render("index")
  async home(
    @Req() req: Request,
    @Query("page") page = 1,
    @Query("perfumeName") perfumeName = "",
    @Query("brand") brand = ""
  ) {
    const limit = 8;
    const currentPage = Math.max(Number(page), 1);
  
    console.log("🔎 Query nhận được:", { perfumeName, brand, page });
  
    const result = await this.perfumesService.getAllPerfumesBySearch(
      perfumeName.trim(),
      brand.trim(), 
      currentPage,
      limit
    );
  
    const allBrands = await this.perfumesService.getAllBrands();
  
    return {
      perfumes: result.data,
      meta: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage,
      },
      brands: allBrands,
      user: req.session.user,
      filters: { perfumeName, brand },
    };
  }
  @Get("/home/json")
async homejson(
    @Req() req: Request,
    @Query("page") page = 1,
    @Query("perfumeName") perfumeName = "",
    @Query("brand") brand = ""
  ) {
    const limit = 8;
    const currentPage = Math.max(Number(page), 1);
  
    console.log("🔎 Query nhận được:", { perfumeName, brand, page });
  
    const result = await this.perfumesService.getAllPerfumesBySearch(
      perfumeName.trim(),
      brand.trim(), 
      currentPage,
      limit
    );
  
    const allBrands = await this.perfumesService.getAllBrands();
  
    return {
      perfumes: result.data,
      meta: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage,
      },
      brands: allBrands,
      user: req.session.user,
      filters: { perfumeName, brand },
    };
  }
  

  @Get('/login')
  loginPage(@Req() req: Request, @Res() res: Response) {
      if (req.session.user) {
          return res.redirect('/'); 
      }
      return res.render('login', { user: null });
  }
  
  @Get('/register')
  registerPage(@Req() req: Request, @Res() res: Response) {
      if (req.session.user) {
          return res.redirect('/'); 
      }
      return res.render('register', { user: null });
  }
  
  

  @Post('/firebase-login')
async firebaseLogin(
  @Body('idToken') idToken: string,
  @Res({ passthrough: true }) res: Response,
) {
  try {
    const { user, access_token } = await this.authService.firebaseAuth(idToken);

    
    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

   
    res.locals.user = user; 

    return res.status(200).json({
      message: 'Firebase login successful',
      access_token,
      user,
    });
  } catch (error: any) {
    console.error('Lỗi Firebase Login:', error.message);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
}


@UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const member = req.user as { _id: string };

    if (!member) {
      return res.status(400).json({ message: 'Member not found' });
    }

    
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    console.log(`Member ${member._id} logged out`);

    return res.redirect('/login');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/dashboard')
  @Render('dashboard')
  async dashboardPage(@Req() req: Request, @Query('page') page = 1) {
    const limit = 50;

    const [perfumesResult, brands, membersResult] = await Promise.all([
      this.perfumesService.getAllPerfumes(Number(page), limit),
      this.brandsService.getAllBrands(),
      this.membersService.getAllMembers(Number(page), limit),
    ]);

    return {
      user: req.session.user,
      perfumes: perfumesResult.data,
      perfumesMeta: {
        total: perfumesResult.total,
        page: perfumesResult.page,
        limit: perfumesResult.limit,
      },
      brands,
      
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('/collectors')
@Render('collectors')
async collectorsPage(@Req() req: Request, @Query('page') page = 1) {
  const limit = 50;

  const [perfumesResult, brands, membersResult] = await Promise.all([
    this.perfumesService.getAllPerfumes(Number(page), limit),
    this.brandsService.getAllBrands(),
    this.membersService.getAllMembers(Number(page), limit),
  ]);

  return {
    user: req.session.user,
    members: membersResult.data,  
    membersMeta: {
      total: membersResult.total,
      page: membersResult.page,
      limit: membersResult.limit,
    },
  };
}

  /** ========== BRANDS ========== */
   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/brands')
  async createBrand(@Body() body) {
    const brandExists = await this.brandsService.getBrandByName(body.brandName);
    if (brandExists) {
      throw new HttpException('Brand already exists!', HttpStatus.BAD_REQUEST);
    }
    const brand = await this.brandsService.createBrand(body);
    return { success: true, message: 'Brand added successfully!', data: brand };
  }
  

  
  @Get('/brands')
  async getAllBrands() {
    return this.brandsService.getAllBrands();
  }


  @Get('/brands/:brandId')
  async getBrandById(@Param('brandId') brandId: string) {
    return this.brandsService.getBrandById(brandId);
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/brands/:brandId')
  async updateBrand(@Param('brandId') brandId: string, @Body() body) {
    const brand = await this.brandsService.updateBrand(brandId, body);
    return { success: true, message: 'Brand update successful!', data: brand };
  }

 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/brands/:brandId')
  async deleteBrand(@Param('brandId') brandId: string) {
    await this.brandsService.deleteBrand(brandId);
    return { success: true, message: 'Brand removal successful!' };
  }

  /** ========== PERFUMES ========== */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/perfumes')
  async createPerfume(@Body() body) {
    const perfume = await this.perfumesService.createPerfume(body);
    return { success: true, message: 'Perfume added successfully!', data: perfume };
  }


  @Get('/perfumes/:id')
  @Render('perfume-detail')
  async perfumeDetail(
    @Param('id') perfumeId: string,
    @Query('page') page = 1,
    @Query('error') errorMessage: string, 
    @Query('success') successMessage: string, 
    @Req() req: any,
  ) {
    const limit = 5;
  
    const [perfume, comments] = await Promise.all([
      this.perfumesService.getPerfumeById(perfumeId),
      this.commentsService.getPerfumeComments(perfumeId, Number(page), limit),
    ]);
  
    if (!perfume) {
      throw new Error('Perfume not found');
    }
  
    const user = req.session.user || req.user || null;
    const memberId = user ? user._id : null; 
    const groupedComments = comments.data.reduce((acc, comment) => {
      if (!acc[comment.rating]) acc[comment.rating] = [];
      acc[comment.rating].push(comment);
      return acc;
    }, {} as Record<number, any[]>);
  
    return {
      perfume,
      comments: comments.data,
      user,
      memberId,
      groupedComments,
  
      commentsMeta: {
        totalPages: Math.ceil(comments.total / limit),
        currentPage: Number(page),
      },
  
      errorMessage,  
      successMessage, 
    };
  }
  
  @Get('/perfumes/:id/json')
  async perfumeDetailJson(
    @Param('id') perfumeId: string,
    @Query('page') page = 1,
    @Query('error') errorMessage: string, 
    @Query('success') successMessage: string, 
    @Req() req: any,
  ) {
    const limit = 5;
  
    const [perfume, comments] = await Promise.all([
      this.perfumesService.getPerfumeById(perfumeId),
      this.commentsService.getPerfumeComments(perfumeId, Number(page), limit),
    ]);
  
    if (!perfume) {
      throw new Error('Perfume not found');
    }
  
    const user = req.session.user || req.user || null;
    const memberId = user ? user._id : null; 
    const groupedComments = comments.data.reduce((acc, comment) => {
      if (!acc[comment.rating]) acc[comment.rating] = [];
      acc[comment.rating].push(comment);
      return acc;
    }, {} as Record<number, any[]>);
  
    return {
      perfume,
      comments: comments.data,
      user,
      memberId,
      groupedComments,
  
      commentsMeta: {
        totalPages: Math.ceil(comments.total / limit),
        currentPage: Number(page),
      },
  
      errorMessage,  
      successMessage, 
    };
  }
  
  @Post('/perfumes/:id/comments')
  async addComment(
    @Param('id') perfumeId: string,
    @Body() body: any,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      console.log('Body:', body);
      const user = req.session.user || req.user || null;
      const userId = user ? user._id : null;
      const { rating, content } = body;
  
      if (!rating || !content) {
        return res.status(400).json({ error: 'Please enter complete information!' });
      }
  
      await this.commentsService.addComment(userId, perfumeId, rating, content);
  
      return res.status(200).json({ 
        success: true,
        message: 'Comment added successfully!'
      });
    } catch (error: any) {
      console.error('Error adding comment:', error.message);
      return res.status(500).json({ error: error.message || 'An error occurred!' });
    }
  }
  
  

  @Get('/perfumes')
async getAllPerfumesNotPage() {
  return this.perfumesService.getAllPerfumesNotPage();
}



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/perfumes/:id')
  async updatePerfume(@Param('id') id: string, @Body() body) {
    const perfume = await this.perfumesService.updatePerfume(id, body);
    return { success: true, message: 'Perfume update successful!', data: perfume };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/perfumes/:id')
  async deletePerfume(@Param('id') id: string) {
    return this.perfumesService.deletePerfume(id);
  }

  /** ========== MEMBERS ========== */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/members/:id')
  async updateMember(@Param('id') id: string, @Body() body: Partial<Member>) {
    return this.membersService.updateMember(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/collectors/json')
  async getAllMembers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.membersService.getAllMembers(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/members/:id')
  async softDelete(@Param('id') id: string) {
    return this.membersService.softDeleteUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/members/:id/promote')
  async promote(@Param('id') id: string) {
    return this.membersService.promoteToAdmin(id);
  }

  
  @UseGuards(JwtAuthGuard) 
  @Get('/profile')
  @Render('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub;  
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const user = await this.membersService.getMemberById(userId);
    return { user };
  }
  @UseGuards(JwtAuthGuard)
@Get('/profile/json')
async getProfileJson(@Req() req: any) {
  const userId = req.user?.sub;  
  if (!userId) {
    throw new BadRequestException('User not authenticated');
  }
  const user = await this.membersService.getMemberById(userId);
  return { user };
}


  @UseGuards(JwtAuthGuard)
  @Post('/profile/update')
  async updateProfile(@Req() req: any, @Body() updateData: Partial<Member>, @Res() res: Response) {
    const userId = req.user?.sub; 
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

   
    const updatedUser = await this.authService.updateProfile(userId, updateData);
    
    return res.redirect('/profile');
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile/change-password')
  async changePassword(
    @Req() req: any,  
    @Body() passwordData: { oldPassword: string; newPassword: string },
    @Res() res: Response
  ) {
    const userId = req.user?.sub; 
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
  
    if (passwordData.oldPassword === passwordData.newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }
  
    await this.authService.changePassword(userId, passwordData.oldPassword, passwordData.newPassword);
    return res.redirect('/profile');
  }
  
}



