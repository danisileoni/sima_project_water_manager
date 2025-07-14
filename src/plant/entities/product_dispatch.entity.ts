import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypePackaging } from './type_packaging.entity';
import { VehicleTransfer } from './vehicle_transfer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ProductDispatch {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date', {
    nullable: false,
  })
  date: Date;

  @Column('text', {
    nullable: false,
  })
  batch_num: string;

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
  responsible: string;

  @Column('text', {
    nullable: false,
  })
  observations: string;

  @Column('boolean', {
    nullable: false,
    default: true,
  })
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

  @ManyToOne(
    () => TypePackaging,
    (typePackaging) => typePackaging.product_dispatch,
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'type_packaging_id' })
  type_packaging: TypePackaging;

  @OneToOne(
    () => VehicleTransfer,
    (vehicleTransfer) => vehicleTransfer.product_dispatch,
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'vehicle_transfer_id' })
  vehicle_transfer: VehicleTransfer;

  @Column({ name: 'user_dispatch_id', nullable: true })
  user_dispatch_id: string;

  @ManyToOne(() => User, (user) => user.product_dispatch)
  @JoinColumn({ name: 'user_dispatch_id' })
  user_dispatch: User;
}
