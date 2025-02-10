import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/application/enums/role.enum';
import { FileUploadService } from 'src/application/usecases/file-upload-service';
import { CreateManutenceRequest, ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ManutenceCreateDto } from '../dto/create-manutence-dto';

@Controller()
export class ManutenceController {
  constructor(
    private readonly manutence_service: ManutenceCreateService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @Roles(Role.USER)
  @UseInterceptors(FileInterceptor('photos'))
  @UseInterceptors(FileInterceptor('video'))
  async createManutence(@Body() request: ManutenceCreateDto, 
  @UploadedFiles() photos: Express.Multer.File[],
  @UploadedFiles() video: Express.Multer.File
) {
    const obj = { photos, video }
    this.fileUploadService.handleFileUpload(obj)
    return await this.manutence_service.execute(request)
  }
}
