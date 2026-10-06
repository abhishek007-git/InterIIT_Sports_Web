import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service.js';
import { TagPhotoDto } from './dto/tag-photo.dto.js';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Body() body: { sportId?: string; uploadedBy: string }) {
    return this.mediaService.create({
      filename: file.filename,
      uploadedBy: body.uploadedBy,
      sportId: body.sportId || null,
    });
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Post(':id/tag')
  tag(@Param('id') id: string, @Body() body: TagPhotoDto) {
    return this.mediaService.tag(id, body.participantId);
  }
}