import { IsOptional, IsString } from 'class-validator';

export class ConfirmResultDto {
  @IsString()
  fixtureId!: string;

  @IsString()
  confirmedBy!: string;

  @IsString()
  value!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}