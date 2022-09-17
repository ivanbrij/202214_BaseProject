import { CityEntity } from "../city/city.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermarketEntity {

   @PrimaryGeneratedColumn("uuid")
   id: string;
   @Column()
   name: string;
   @Column()
   latitude: string;
   @Column()
   longitude: string;
   @Column()
   webpage: string;


   @ManyToMany(() => CityEntity, (city) => city.supermarkets)
   cities: CityEntity[];

}