import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedPackaging1742338594149 implements MigrationInterface {
    name = 'UpdatedPackaging1742338594149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:35.851Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:35.851Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:36.137Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:36.137Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:36.154Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:36.154Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:36.154Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:36.154Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:36.155Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:36.155Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:56:36.155Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:56:36.155Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18T22:54:56.483Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-18'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "size" numeric NOT NULL`);
    }

}
