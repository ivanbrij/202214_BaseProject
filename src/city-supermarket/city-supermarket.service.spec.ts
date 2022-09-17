import { Test, TestingModule } from '@nestjs/testing';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CitySupermarketService } from './city-supermarket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;
  let city: CityEntity;
  let supermarketsList : SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    supermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermarketRepository.clear();
    cityRepository.clear();

    supermarketsList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermarketEntity = await supermarketRepository.save({
          name: faker.company.name(), 
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude(),
          webpage: faker.internet.url()
        })
        supermarketsList.push(supermarket);
    }

    city = await cityRepository.save({
      name: faker.address.city(),
      country: faker.address.country(),
      population: faker.datatype.number({min: 1000}),
      supermarkets: supermarketsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an supermarket to a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()
    });

    const newCity: CityEntity = await cityRepository.save({
      name: faker.address.city(),
      country: faker.address.country(),
      population: faker.datatype.number({min: 1000}),
      supermarkets: []
    })

    const result: CityEntity = await service.addSupermarketToCity(newCity.id, newSupermarket.id);
    
    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name)
    expect(result.supermarkets[0].latitude).toBe(newSupermarket.latitude)
    expect(result.supermarkets[0].longitude).toBe(newSupermarket.longitude)
    expect(result.supermarkets[0].webpage).toBe(newSupermarket.webpage)
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.address.city(),
      country: faker.address.country(),
      population: faker.datatype.number({min: 1000})
    })

    await expect(() => service.addSupermarketToCity(newCity.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()
    });

    await expect(() => service.addSupermarketToCity("0", newSupermarket.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    const storedSupermarket: SupermarketEntity = await service.findSupermarketFromCity(city.id, supermarket.id, )
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toBe(supermarket.name);
    expect(storedSupermarket.latitude).toBe(supermarket.latitude);
    expect(storedSupermarket.longitude).toBe(supermarket.longitude);
    expect(storedSupermarket.webpage).toBe(supermarket.webpage);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(()=> service.findSupermarketFromCity(city.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0]; 
    await expect(()=> service.findSupermarketFromCity("0", supermarket.id)).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('findSupermarketFromCity should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()
    });

    await expect(()=> service.findSupermarketFromCity(city.id, newSupermarket.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city"); 
  });

  it('findSupermarketsFromCity should return supermarkets by city', async ()=>{
    const supermarkets: SupermarketEntity[] = await service.findSupermarketsFromCity(city.id);
    expect(supermarkets.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('updateSupermarketsFromCity should update supermarkets list for a city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url() 
    });

    const updatedCity: CityEntity = await service.updateSupermarketsFromCity(city.id, [newSupermarket]);
    expect(updatedCity.supermarkets.length).toBe(1);

    expect(updatedCity.supermarkets[0].name).toBe(newSupermarket.name);
    expect(updatedCity.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(updatedCity.supermarkets[0].longitude).toBe(newSupermarket.longitude);
    expect(updatedCity.supermarkets[0].webpage).toBe(newSupermarket.webpage);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()
    });

    await expect(()=> service.updateSupermarketsFromCity("0", [newSupermarket])).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarket: SupermarketEntity = supermarketsList[0];
    newSupermarket.id = "0";

    await expect(()=> service.updateSupermarketsFromCity(city.id, [newSupermarket])).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('deleteSupermarketFromCity should remove an supermarket from a city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    
    await service.deleteSupermarketFromCity(city.id, supermarket.id);

    const storedCity: CityEntity = await cityRepository.findOne({where: {id: city.id}, relations: ["supermarkets"]});
    const deletedSupermarket: SupermarketEntity = storedCity.supermarkets.find(a => a.id === supermarket.id);

    expect(deletedSupermarket).toBeUndefined();

  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(()=> service.deleteSupermarketFromCity(city.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found"); 
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermarket.id)).rejects.toHaveProperty("message", "The city with the given id was not found"); 
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(), 
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()
    });

    await expect(()=> service.deleteSupermarketFromCity(city.id, newSupermarket.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city"); 
  }); 

});