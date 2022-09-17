import {IsNotEmpty, IsString, IsNumber, IsEnum} from 'class-validator';
import { PaisPermitido } from './city.entity';
export class CityDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 @IsEnum(PaisPermitido)
 readonly country: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly population: number;
}