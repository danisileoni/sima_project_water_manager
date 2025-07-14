import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Province } from './province.entity';

@Entity()
export class City {
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
  postal_code: string;

  @ManyToOne(() => Province, (province) => province.cities)
  province: Province;

  @OneToMany(() => Address, (address) => address.city)
  addresses: Address[];

  @DeleteDateColumn()
  deletedAt: Date;
}
