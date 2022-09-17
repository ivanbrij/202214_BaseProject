import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';

@Module({
  providers: [SupermarketService]
})
export class SupermarketModule {}
