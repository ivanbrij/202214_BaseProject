import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';

@Module({
  imports: [CityModule, SupermarketModule, CitySupermarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
