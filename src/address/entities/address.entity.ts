import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { City } from './city.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  street: string;

  @ManyToOne(() => Province, { eager: true, nullable: true })
  province: Province;

  @ManyToOne(() => City, { eager: true, nullable: true })
  city: City;

  @DeleteDateColumn()
  deletedAt: Date;
}
