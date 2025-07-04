import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/application/enums/role.enum';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ManutenceCreateDto } from '../dto/create-manutence-dto';
import { FindOneParams } from '../dto/find-one-manutence-dto';
import { FindOneManutenceService } from 'src/application/usecases/find-one-manutence-service';
import { ManutenceViewModel } from '../view-models/manutence-view-model';
import { FindAllManutences } from 'src/application/usecases/find-all-manutences-service';
import { Manutence } from 'src/application/entities/manutence';
import { DeleteManutenceService } from 'src/application/usecases/delete-manutence-service';
import { ManutenceFiltersDto } from '../dto/find-by-filter-manutence-dto';
import { FindManutenceByFilters } from '@application/usecases/find-by-filter-manutence-dto';
import { PaginationDto } from '../dto/pagination-dto';
import { GetCountNewManutences } from '@application/usecases/count-new-manutences-service';
import { StatusManutence } from '@application/enums/StatusManutence';
import { RolesGuard } from '@application/guards/role.guards';
import { UserId } from '@application/utils/extract-user-id';
import { FileUploadService } from '@application/usecases/file-upload-service';
import { AcceptManutenceService } from '@application/usecases/accept-manutence-service';
import { FinishManutenceService } from '@application/usecases/finish-manutence-service';

@Controller('manutences')
export class ManutenceController {
  constructor(
    private readonly manutenceCreate_service: ManutenceCreateService,
    private readonly manutenceGetOne_service: FindOneManutenceService,
    private readonly manutencesGetAll_service: FindAllManutences,
    private readonly manutenceDelete_service: DeleteManutenceService,
    private readonly manutenceGetAllNewCount_service: GetCountNewManutences,
    private readonly manutenceGetByFilters_service: FindManutenceByFilters,
    private readonly fileUploadService: FileUploadService,
    private readonly acceptManutenceService: AcceptManutenceService,
    private readonly finishManutenceService: FinishManutenceService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createManutence(
    @UserId() userId: string,
    @Body() request: ManutenceCreateDto,
  ) {
    const r = { ...request, userId };
    console.log('request', request);
    return await this.manutenceCreate_service.execute(r);
  }

  @Post('put/presigned-url')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async getPreSignedUrl(
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return await this.fileUploadService.generatePutSignedUrls(files);
  }

  @Post('get-presigned-urls')
  async getPresignedUrls(@Body() body: { fileNames: string[] }) {
    const fileNames = body.fileNames;
    const signedUrls =
      await this.fileUploadService.generateGetSignedUrls(fileNames);
    return signedUrls;
  }

  @Get('get/id/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getManutence(@Param() param: FindOneParams) {
    const { manutence } = await this.manutenceGetOne_service.execute(param);

    const formatted = ManutenceViewModel.toGetFormatHttp(manutence);
    if (formatted.photos.length) {
      const fileNames = formatted.photos.map((photo) => photo.fileName);

      const signedUrls =
        await this.fileUploadService.generateGetSignedUrls(fileNames);

      formatted.photos = signedUrls.map((url, index) => ({
        fileName: fileNames[index],
        signedUrl: url.signedUrl,
      }));
    }

    if (formatted.video) {
      const videoUrl = formatted.video.map((video) => video.fileName);
      const signedUrls =
        await this.fileUploadService.generateGetSignedUrls(videoUrl);
      formatted.video = signedUrls.map((url, index) => ({
        fileName: videoUrl[index],
        signedUrl: url.signedUrl,
      }));
    }

    return formatted;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllManutences(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      // Convert page-based pagination to skip-based for internal service
      const skip = (page - 1) * limit;
      const pagination = { skip, limit };
      const result = await this.manutencesGetAll_service.execute(pagination);
      const { manutences } = result;

      const formattedManutences = await Promise.all(
        manutences.map(async (manutence: Manutence) => {
          const formatted = ManutenceViewModel.toGetFormatHttp(manutence);
          if (formatted.photos.length) {
            const fileNames = formatted.photos.map((photo) => photo.fileName);

            const signedUrls =
              await this.fileUploadService.generateGetSignedUrls(fileNames);

            formatted.photos = signedUrls.map((url, index) => ({
              fileName: fileNames[index],
              signedUrl: url.signedUrl,
            }));
          }

          return formatted;
        }),
      );

      // Retorna dados paginados estruturados
      return {
        data: formattedManutences,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total || manutences.length,
          totalPages: Math.ceil((result.total || manutences.length) / Number(limit))
        }
      };
    } catch (error) {
      console.error('Error in getAllManutences:', error);
      throw error;
    }
  }
  @Get('get/filters')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getManutencesByFilters(
    @Query(new ValidationPipe({ transform: true }))
    filters: ManutenceFiltersDto,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    const { manutences } = await this.manutenceGetByFilters_service.execute(
      filters,
      pagination,
    );

    return Promise.all(
      manutences.map(async (manutence: Manutence) => {
        const formatted = ManutenceViewModel.toGetFormatHttp(manutence);

        if (formatted.photos.length) {
          const fileNames = formatted.photos.map((photo) => photo.fileName);

          const signedUrls =
            await this.fileUploadService.generateGetSignedUrls(fileNames);

          formatted.photos = signedUrls.map((url, index) => ({
            fileName: fileNames[index],
            signedUrl: url.signedUrl,
          }));
        }

        // if (formatted.video) {
        //   formatted.video = (
        //     await this.fileUploadService.getGenerateSignedUrls([
        //       formatted.video,
        //     ])
        //   )[0];
        // }

        return formatted;
      }),
    );
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.USER, Role.ADMIN)
  async deleteManutence(@Param('id') param: string) {
    return await this.manutenceDelete_service.execute(param);
  }

  @Get('get/manutences_notifications')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getCountNewManutences() {
    return await this.manutenceGetAllNewCount_service.execute(
      StatusManutence.NOVO,
    );
  }

  @Get('take/manutence/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async takeManutence(@Param('id') param: FindOneParams) {
    // update status_manutence to ANDAMENTO
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.ADMIN)
  async acceptManutence(
    @Param() param: FindOneParams,
    @UserId() adminId: string,
  ) {
    return await this.acceptManutenceService.execute({
      manutenceId: param.id,
      adminId,
    });
  }

  @Post('finish/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.ADMIN)
  async finishManutence(
    @Param('id') param: string,
    @Body() body: { status: StatusManutence },
  ) {
    return await this.finishManutenceService.execute(param, body.status);
  }
}
