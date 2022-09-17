import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { CityEntity } from '../city/city.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CitySupermarketService {
    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>,
     
        @InjectRepository(SupermarketEntity)
        private readonly supermarketRepository: Repository<SupermarketEntity>
    ) {}

    async addSupermarketToCity(cityId: string, supermarketId: string): Promise<CityEntity> {
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND);
       
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}, relations: ["supermarkets"]}) 
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND);
     
        city.supermarkets = [...city.supermarkets, supermarket];
        return await this.cityRepository.save(city);
      }
     
    async findSupermarketFromCity(cityId: string, supermarketId: string): Promise<SupermarketEntity> {
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
        
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}, relations: ["supermarkets"]}); 
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
    
        const citySupermarket: SupermarketEntity = city.supermarkets.find(e => e.id === supermarket.id);
    
        if (!citySupermarket)
          throw new BusinessLogicException("The supermarket with the given id is not associated to the city", BusinessError.PRECONDITION_FAILED)
    
        return citySupermarket;
    }
     
    async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}, relations: ["supermarkets"]});
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
        
        return city.supermarkets;
    }
     
    async updateSupermarketsFromCity(cityId: string, supermarkets: SupermarketEntity[]): Promise<CityEntity> {
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}, relations: ["supermarkets"]});
     
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < supermarkets.length; i++) {
          const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarkets[i].id}});
          if (!supermarket)
            throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        city.supermarkets = supermarkets;
        return await this.cityRepository.save(city);
      }
     
    async deleteSupermarketFromCity(cityId: string, supermarketId: string){
        const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({where: {id: supermarketId}});
        if (!supermarket)
          throw new BusinessLogicException("The supermarket with the given id was not found", BusinessError.NOT_FOUND)
     
        const city: CityEntity = await this.cityRepository.findOne({where: {id: cityId}, relations: ["supermarkets"]});
        if (!city)
          throw new BusinessLogicException("The city with the given id was not found", BusinessError.NOT_FOUND)
     
        const citySupermarket: SupermarketEntity = city.supermarkets.find(e => e.id === supermarket.id);
     
        if (!citySupermarket)
            throw new BusinessLogicException("The supermarket with the given id is not associated to the city", BusinessError.PRECONDITION_FAILED)

        city.supermarkets = city.supermarkets.filter(e => e.id !== supermarketId);
        await this.cityRepository.save(city);
    }   
}