import { Client } from '../../delivery/entities/client.entity';
import { ControlProduct } from '../../plant/entities/control_product.entity';
import { ProductDispatch } from '../../plant/entities/product_dispatch.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: false,
  })
  surname: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('numeric', {
    nullable: false,
    unique: true,
  })
  dni: number;

  @Column('text', {
    nullable: false,
    select: false,
  })
  password: string;

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

  @Column('text', {
    array: true,
  })
  role: string[];

  @Column('boolean', {
    default: true,
  })
  is_active: boolean;

  @Column('text', {
    nullable: true,
  })
  hash_refresh_token: string;

  @OneToMany(() => ProductDispatch, (productDispatch) => productDispatch.user)
  product_dispatch: ProductDispatch[];

  @OneToMany(() => ControlProduct, (controlProduct) => controlProduct.user)
  control_product: ControlProduct[];

  @OneToMany(() => Client, (client) => client.user)
  client: Client[];

  @BeforeInsert()
  checkFieldsBeforeInsert(): void {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate(): void {
    this.checkFieldsBeforeInsert();
  }
}
