import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductDispatch } from './product_dispatch.entity';

@Entity()
export class VehicleTransfer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', {
    nullable: false,
  })
  vehicle: string;

  @Column('text', {
    nullable: false,
  })
  num_domain: string;

  @OneToOne(
    () => ProductDispatch,
    (productDispatch) => productDispatch.vehicle_transfer,
  )
  product_dispatch: ProductDispatch;
}
