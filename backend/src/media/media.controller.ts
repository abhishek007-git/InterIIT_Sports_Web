import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MediaService } from './media.service.js';
import { TagPhotoDto } from './dto/tag-photo.dto.js';

type UploadedMediaFile = {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: UploadedMediaFile, @Body() body: { sportId?: string; uploadedBy: string }) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: 'sports-meet' }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Upload failed'));
          return;
        }
        resolve(result.secure_url);
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return this.mediaService.create({
      filename: url,
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