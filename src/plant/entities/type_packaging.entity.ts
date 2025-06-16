// type_packaging.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductDispatch } from './product_dispatch.entity';
import { ClientProduct } from '../../delivery/entities/client_product.entity';

@Entity()
export class TypePackaging {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  packaging: string;

  @Column('numeric', {
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  liters: number;

  @Column('numeric', {
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  milliliters: number;

  @Column('boolean', { nullable: false, default: true })
  is_active: boolean;

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

  @OneToMany(
    () => ProductDispatch,
    (productDispatch) => productDispatch.type_packaging,
  )
  product_dispatch: ProductDispatch[];

  @OneToMany(
    () => ClientProduct,
    (clientProduct) => clientProduct.type_packaging,
  )
  client_products: ClientProduct[];
}
