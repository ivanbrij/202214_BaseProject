import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService]
})
export class CityModule {}
