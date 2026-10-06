import { IsString } from 'class-validator';

export class TagPhotoDto {
  @IsString()
  participantId!: string;
}