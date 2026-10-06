import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  create(data: { filename: string; uploadedBy: string; sportId: string | null }) {
    return this.prisma.mediaAsset.create({ data });
  }

  findAll() {
    return this.prisma.mediaAsset.findMany({
      include: { sport: true, photoTags: { include: { participant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  tag(mediaAssetId: string, participantId: string) {
    return this.prisma.photoTag.create({ data: { mediaAssetId, participantId } });
  }
}