import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CitySupermarketService } from './city-supermarket.service';
import { SupermarketDto } from '../supermarket/supermarket.dto';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
   constructor(private readonly citySupermarketService: CitySupermarketService){}

   @Post(':cityId/supermarkets/:supermarketId')
   async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.citySupermarketService.addSupermarketToCity(cityId, supermarketId);
   }

   @Get(':cityId/supermarkets/:supermarketId')
   async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.citySupermarketService.findSupermarketFromCity(cityId, supermarketId);
   }

   @Get(':cityId/supermarkets')
   async findSupermarketsFromCity(@Param('cityId') cityId: string){
       return await this.citySupermarketService.findSupermarketsFromCity(cityId);
   }

   @Put(':cityId/supermarkets')
   async updateSupermarketsFromCity(@Body() supermarketsDto: SupermarketDto[], @Param('cityId') cityId: string){
       const supermarkets = plainToInstance(SupermarketEntity, supermarketsDto)
       return await this.citySupermarketService.updateSupermarketsFromCity(cityId, supermarkets);
   }

   @Delete(':cityId/supermarkets/:supermarketId')
   @HttpCode(204)
   async deleteSupermarketCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.citySupermarketService.deleteSupermarketFromCity(cityId, supermarketId);
   }
}