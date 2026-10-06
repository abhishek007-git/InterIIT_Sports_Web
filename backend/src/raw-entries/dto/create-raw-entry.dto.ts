import { IsOptional, IsString } from 'class-validator';

export class CreateRawEntryDto {
  @IsString()
  fixtureId!: string;

  @IsString()
  enteredBy!: string;

  @IsString()
  value!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}