import { IsDateString, IsString } from 'class-validator';

export class CreateFixtureDto {
  @IsString()
  disciplineId!: string;

  @IsString()
  venueId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  stage!: string;
}