import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedPackaging1742338494474 implements MigrationInterface {
    name = 'UpdatedPackaging1742338494474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plant" RENAME COLUMN "isActive" TO "is_active"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "liters" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "milliliters" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "created_at" date NOT NULL DEFAULT '2025-03-18T22:54:56.465Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "updated_at" date NOT NULL DEFAULT '2025-03-18T22:54:56.465Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.175Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.175Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-05T01:47:25.088Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-05T01:47:25.088Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-05T01:47:25.106Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-05T01:47:25.106Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-05'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-05'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-05T01:47:25.106Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-05T01:47:25.106Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-05'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-05'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "milliliters"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "liters"`);
        await queryRunner.query(`ALTER TABLE "plant" RENAME COLUMN "is_active" TO "isActive"`);
    }

}
