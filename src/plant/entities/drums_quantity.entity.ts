import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ControlProduct } from './control_product.entity';

@Entity()
export class DrumsQuantity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('numeric', {
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantity_enter: number;

  @Column('numeric', {
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantity_out: number;

  @OneToOne(
    () => ControlProduct,
    (controlProduct) => controlProduct.drums_quantity,
  )
  control_product: ControlProduct;
}
