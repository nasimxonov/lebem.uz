import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
