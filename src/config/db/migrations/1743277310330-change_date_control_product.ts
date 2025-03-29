import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDateControlProduct1743277310330
  implements MigrationInterface
{
  name = 'ChangeDateControlProduct1743277310330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:41:51.877Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:41:51.877Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:41:51.892Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:41:51.892Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:41:51.896Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:41:51.896Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:41:51.896Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:41:51.896Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "drums_quantity" ALTER COLUMN "quantity_enter" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drums_quantity" ALTER COLUMN "quantity_enter" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`,
    );
  }
}
