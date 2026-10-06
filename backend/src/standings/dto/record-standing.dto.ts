import { IsInt, IsOptional, IsString } from 'class-validator';

export class RecordStandingDto {
  @IsString()
  fixtureId!: string;

  @IsString()
  institutionId!: string;

  @IsOptional()
  @IsString()
  participantId?: string;

  @IsInt()
  rank!: number;

  @IsInt()
  points!: number;
}