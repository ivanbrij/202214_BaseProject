import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CityEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   name: string;
   @Column()
   country: string;
   @Column()
   population: number;

   @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
   @JoinTable()
   supermarkets: SupermarketEntity[];

}

export enum PaisPermitido {
   ARGENTINA = "ARGENTINA",
   ECUADOR = "ECUADOR",
   PARAGUAY = "PARAGUAY"
 }
