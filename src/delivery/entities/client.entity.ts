import { User } from '../../users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientProduct } from './client_product.entity';
import { Address } from '../../address/entities/address.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    nullable: false,
  })
  name_or_company: string;

  @Column('text', {
    nullable: false,
  })
  contact: string;

  @Column('numeric', {
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantity: number;

  @Column('text')
  observations: string;

  @Column('text', {
    nullable: false,
  })
  dni_cuit: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.client)
  user: User;

  @OneToMany(() => ClientProduct, (clientProduct) => clientProduct.client)
  client_products: ClientProduct[];

  @OneToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @JoinColumn()
  address: Address;

  @DeleteDateColumn()
  deletedAt: Date;
}
