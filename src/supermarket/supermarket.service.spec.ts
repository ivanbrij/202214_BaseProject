import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';

import { faker } from '@faker-js/faker';

describe('SupermarketService', () => {
 let service: SupermarketService;
 let repository: Repository<SupermarketEntity>;
 let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketsList = [];
    for(let i = 0; i < 5; i++){
      const supermarket: SupermarketEntity = await repository.save({
      name: faker.company.name(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url()})
      supermarketsList.push(supermarket);
    }
  }

  it('should be defined', () => {
   expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketsList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketsList[0];
    const supermarket: SupermarketEntity = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name)
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude)
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude)
    expect(supermarket.webpage).toEqual(storedSupermarket.webpage)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: faker.company.name(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      webpage: faker.internet.url(),
      cities: []
    }
 
    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();
 
    const storedSupermarket: SupermarketEntity = await repository.findOne({where: {id: newSupermarket.id}})
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name)
    expect(storedSupermarket.latitude).toEqual(newSupermarket.latitude)
    expect(storedSupermarket.longitude).toEqual(newSupermarket.longitude)
    expect(storedSupermarket.webpage).toEqual(newSupermarket.webpage)
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    supermarket.name = "New name";
    supermarket.webpage = "New web page";
     const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
     const storedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name)
    expect(storedSupermarket.webpage).toEqual(supermarket.webpage)
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermarketEntity = supermarketsList[0];
    supermarket = {
      ...supermarket, name: "New name", webpage: "New web page"
    }
    await expect(() => service.update("0", supermarket)).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  }); 

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await service.delete(supermarket.id);
     const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });


});
