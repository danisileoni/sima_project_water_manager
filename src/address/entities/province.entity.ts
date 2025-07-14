import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { City } from './city.entity';

@Entity()
export class Province {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  country: string;

  @OneToMany(() => Address, (address) => address.province)
  addresses: Address[];

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @DeleteDateColumn()
  deletedAt: Date;
}
