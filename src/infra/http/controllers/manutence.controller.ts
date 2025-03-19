import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { FilesTypeInterface } from '@application/interfaces/files-type-interface';
import { UserId } from '@application/utils/extract-user-id';
import { FileUploadService } from '@application/usecases/file-upload-service';

@Controller('manutence')
export class ManutenceController {
  constructor(
    private readonly manutenceCreate_service: ManutenceCreateService,
    private readonly manutenceGetOne_service: FindOneManutenceService,
    private readonly manutencesGetAll_service: FindAllManutences,
    private readonly manutenceDelete_service: DeleteManutenceService,
    private readonly manutenceGetAllNewCount_service: GetCountNewManutences,
    private readonly manutenceGetByFilters_service: FindManutenceByFilters,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createManutence(
    @UserId() userId: string,
    @Body() request: ManutenceCreateDto,
    //@UploadedFiles()
    //files: { photos?: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    //const fileData: FilesTypeInterface = {
    //   photos: files.photos || [],
    //    video: files.video[0],
    //   };

    const r = { ...request, userId };

    return await this.manutenceCreate_service.execute(r /*fileData*/);
  }

  @Post('get/presigned-url')
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
      video: Express.Multer.File[];
    },
  ) {
    const fileData: FilesTypeInterface = {
      photos: files.photos || [],
      video: files.video[0],
    };

    return await this.fileUploadService.handleFileUpload(fileData);
  }

  @Get('get/id/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getManutence(@Param('id') param: FindOneParams) {
    const { manutence } = await this.manutenceGetOne_service.execute(param);

    return ManutenceViewModel.toGetFormatHttp(manutence);
  }

  @Get('get/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllManutences(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    pagination: PaginationDto,
  ) {
    const { manutences } =
      await this.manutencesGetAll_service.execute(pagination);

    return Promise.all(
      manutences.map(async (manutence: Manutence) => {
        const formatted = ManutenceViewModel.toGetFormatHttp(manutence);

        if (formatted.photos?.length) {
          formatted.photos = await this.fileUploadService.getGenerateSignedUrls(
            formatted.photos,
          );
        }
        if (formatted.video) {
          formatted.video = (
            await this.fileUploadService.getGenerateSignedUrls([
              formatted.video,
            ])
          )[0];
        }

        return formatted;
      }),
    );
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

        if (formatted.photos?.length) {
          formatted.photos = await this.fileUploadService.getGenerateSignedUrls(
            formatted.photos,
          );
        }
        if (formatted.video) {
          formatted.video = (
            await this.fileUploadService.getGenerateSignedUrls([
              formatted.video,
            ])
          )[0];
        }

        return formatted;
      }),
    );
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
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
}
