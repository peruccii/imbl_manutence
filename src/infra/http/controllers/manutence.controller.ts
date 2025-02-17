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
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/application/enums/role.enum';
import { FileUploadService } from 'src/application/usecases/file-upload-service';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ManutenceCreateDto } from '../dto/create-manutence-dto';
import multerConfig from 'src/application/config/multer-config';
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

@Controller('manutence')
export class ManutenceController {
  constructor(
    private readonly manutenceCreate_service: ManutenceCreateService,
    private readonly fileUploadService: FileUploadService,
    private readonly manutenceGetOne_service: FindOneManutenceService,
    private readonly manutencesGetAll_service: FindAllManutences,
    private readonly manutenceDelete_service: DeleteManutenceService,
    private readonly manutenceGetByFilters_service: FindManutenceByFilters,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('photos', multerConfig))
  @UseInterceptors(FileInterceptor('video', multerConfig))
  async createManutence(
    @Body() request: ManutenceCreateDto,
    @UploadedFiles() photos: MulterFilesS3,
    @UploadedFile() video: MulterFileS3,
  ) {
    const uploadedFiles = {
      photos: photos.map((file) => file.location),
      video: video.location,
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

    return ManutenceViewModel.toGetFormatHttp(manutence);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getAllManutences() {
    const { manutences } = await this.manutencesGetAll_service.execute();

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
    return this.manutenceGetByFilters_service.execute(filters);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async deleteManutence(@Param('id') param: string) {
    return await this.manutenceDelete_service.execute(param);
  }
}
