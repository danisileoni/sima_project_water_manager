import { TypePackaging } from '../../plant/entities/type_packaging.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class ClientProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('numeric', {
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantity: number;

  @Column('text', {
    nullable: false,
  })
  batch_of_product: string;

  @ManyToOne(
    () => TypePackaging,
    (type_packaging) => type_packaging.client_products,
  )
  type_packaging: TypePackaging;

  @ManyToOne(() => Client, (client) => client.client_products)
  client: Client;
}
