import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;

  @IsIn(['super_admin', 'head_organizer', 'venue_staff', 'registration_admin'])
  role!: string;
}