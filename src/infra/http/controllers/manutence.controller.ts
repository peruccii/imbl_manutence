import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@Controller('manutence')
export class ManutenceController {
  constructor(
    private readonly manutenceCreate_service: ManutenceCreateService,
    private readonly fileUploadService: FileUploadService,
    private readonly manutenceGetOne_service: FindOneManutenceService
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
  async getManutence(@Param('id') param: FindOneParams) {
    const { manutence } = await this.manutenceGetOne_service.execute(param)

    return ManutenceViewModel.toGetFormatHttp(manutence)
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllManutences() {

  }
}
