import { Module } from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';

@Module({
  providers: [CitySupermarketService]
})
export class CitySupermarketModule {}
