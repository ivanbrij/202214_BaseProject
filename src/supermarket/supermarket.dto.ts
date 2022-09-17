import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, IsUrl, MinLength } from "class-validator";

export class SupermarketDto {
   @IsString()
   @IsNotEmpty()
   @MinLength(10)
   readonly name: string;

   @IsString()
   @IsNotEmpty()
   @IsLatitude()
   readonly latitude: string;

   @IsString()
   @IsNotEmpty()
   @IsLongitude()
   readonly longitude: string;

   @IsUrl()
   @IsNotEmpty()
   readonly webpage: string;
}