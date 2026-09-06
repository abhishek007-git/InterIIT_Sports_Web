import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  name!: string;

  @IsString()
  registrationNo!: string;

  @IsString()
  gender!: string;

  @IsString()
  mobile!: string;

  @IsEmail()
  email!: string;

  @IsString()
  foodPreference!: string;

  @IsString()
  bloodGroup!: string;

  @IsOptional()
  @IsISO8601()
  arrivalAt?: string;

  @IsOptional()
  @IsISO8601()
  departureAt?: string;

  @IsString()
  emergencyContact!: string;

  @IsString()
  institutionId!: string;

  @IsString()
  sportId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  disciplineIds!: string[];

  @IsOptional()
  @IsString()
  weightCategory?: string;
}
