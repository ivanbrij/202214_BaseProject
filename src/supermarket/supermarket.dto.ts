import { IsNotEmpty, IsNumber, IsString, IsUrl, MinLength } from "class-validator";

export class SupermarketDto {
   @IsString()
   @IsNotEmpty()
   @MinLength(10)
   readonly name: string;

   @IsNumber()
   @IsNotEmpty()
   readonly latitude: number;

   @IsNumber()
   @IsNotEmpty()
   readonly longitude: number;

   @IsUrl()
   @IsNotEmpty()
   readonly webpage: string;
}