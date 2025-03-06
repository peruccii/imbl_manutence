import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, type MulterModuleOptions } from '@nestjs/platform-express';
import { Role } from 'src/application/enums/role.enum';
import { FileUploadService } from 'src/application/usecases/file-upload-service';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ManutenceCreateDto } from '../dto/create-manutence-dto';
import { MulterFileS3, MulterFilesS3 } from '../MulterType/s3multer-type';
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
// import type { S3ServiceUseCase } from '@application/usecases/s3-service';

@Controller('manutence')
export class ManutenceController {
  constructor(
    private readonly manutenceCreate_service: ManutenceCreateService,
    private readonly fileUploadService: FileUploadService,
    private readonly manutenceGetOne_service: FindOneManutenceService,
    private readonly manutencesGetAll_service: FindAllManutences,
    private readonly manutenceDelete_service: DeleteManutenceService,
    private readonly manutenceGetAllNewCount_service: GetCountNewManutences,
    private readonly manutenceGetByFilters_service: FindManutenceByFilters,
    // private readonly s3Service: S3ServiceUseCase,

  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(
  FilesInterceptor('photos', 10), 
  FileInterceptor('video'))
  async createManutence(
    @Body() request: ManutenceCreateDto,
    @UploadedFiles() photos: MulterFilesS3,
    @UploadedFile() video: MulterFileS3,
  ) {
    
    const uploadedFiles = {
      photos: photos?.map((file) => ({ key: file.key })) || [],
      video: video.key,                              
    };
    
    request.photos = uploadedFiles.photos;
    request.video = uploadedFiles.video;

    const obj = { photos, video };
    this.fileUploadService.handleFileUpload(obj);
    return await this.manutenceCreate_service.execute(request);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  async getManutence(@Param('id') param: FindOneParams) {
    const { manutence } = await this.manutenceGetOne_service.execute(param);

    // manutence.photos = await Promise.all( // ts code will let my request more longer ( time )
    //   manutence.photos.map(async (foto) => ({
    //     key: foto.key,
    //     url: await this.s3Service.getSignedUrl(foto.key),
    //   }))
    // ); 
    
    // manutence.video = await this.s3Service.getSignedUrl(manutence.video) 

    return ManutenceViewModel.toGetFormatHttp(manutence);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getAllManutences(@Query() pagination: PaginationDto) {
    const { manutences } =
      await this.manutencesGetAll_service.execute(pagination);

    return manutences.map((manutence: Manutence) => {
      return ManutenceViewModel.toGetFormatHttp(manutence);
    });
  }

  @Get('filters')
  @Roles(Role.USER, Role.ADMIN)
  async getManutencesByFilters(
    @Query() filters: ManutenceFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.manutenceGetByFilters_service.execute(filters, pagination);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async deleteManutence(@Param('id') param: string) {
    return await this.manutenceDelete_service.execute(param);
  }

  @Get('manutences_notifications')
  @Roles(Role.USER, Role.ADMIN)
  async getCountNewManutences() {
    return await this.manutenceGetAllNewCount_service.execute(
      StatusManutence.CREATED,
    );
  }
}
