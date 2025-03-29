import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DrumsQuantity } from './drums_quantity.entity';
import { User } from '../../users/entities/user.entity';
@Entity()
export class ControlProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date', { nullable: false })
  date: Date;

  @Column('text', { nullable: false, unique: true })
  batch_num: string;

  @Column('text', { nullable: false })
  responsible: string;

  @Column('text', { nullable: false })
  observations: string;

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

  @OneToOne(
    () => DrumsQuantity,
    (drumsQuantity) => drumsQuantity.control_product,
    { cascade: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'drums_quantity_id' })
  drums_quantity: DrumsQuantity;

  @ManyToOne(() => User, (user) => user.control_product)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
