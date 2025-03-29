import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDateControlProduct21743277873247 implements MigrationInterface {
    name = 'ChangeDateControlProduct21743277873247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:51:14.804Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:51:14.804Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:51:14.818Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:51:14.818Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:51:14.822Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:51:14.822Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:51:14.822Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:51:14.822Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
    }

}
