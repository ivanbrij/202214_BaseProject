import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { CityEntity } from '../city/city.entity';
import { CitySupermarketService } from './city-supermarket.service';
import { CitySupermarketController } from './city-supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  providers: [CitySupermarketService],
  controllers: [CitySupermarketController]
})
export class CitySupermarketModule {}
