// type_packaging.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductDispatch } from './product_dispatch.entity';

@Entity()
export class TypePackaging {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  packaging: string;

  @Column('numeric', { default: 0 })
  liters: number;

  @Column('numeric', { default: 0 })
  milliliters: number;

  @Column('boolean', { nullable: false, default: true })
  is_active: boolean;

  @Column('date', {
    nullable: false,
    default: new Date().toISOString(),
  })
  created_at: Date;

  @Column('date', {
    nullable: false,
    default: new Date().toISOString(),
    onUpdate: new Date().toISOString(),
  })
  updated_at: Date;

  @OneToMany(
    () => ProductDispatch,
    (productDispatch) => productDispatch.type_packaging,
  )
  product_dispatch: ProductDispatch;
}
