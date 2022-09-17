import {IsNotEmpty, IsString, IsNumber, IsEnum, Matches} from 'class-validator';
export class CityDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 @Matches(/^ECUADOR|ARGENTINA|PARAGUAY$/i, {message: 'Countries allowed are: Ecuador, Argentina, Paraguay'})
 readonly country: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly population: number;
}