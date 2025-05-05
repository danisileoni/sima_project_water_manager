import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationUpdateExcel1744301734683 implements MigrationInterface {
    name = 'MigrationUpdateExcel1744301734683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product_excel" RENAME COLUMN "name" TO "file_name"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" RENAME COLUMN "name" TO "file_name"`);
        await queryRunner.query(`ALTER TABLE "client_excel" RENAME COLUMN "name" TO "file_name"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.263Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.263Z'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.281Z'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.281Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.292Z'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.543Z'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.543Z'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.759Z'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.759Z'`);
        await queryRunner.query(`ALTER TABLE "client_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-10T16:15:36.968Z'`);
        await queryRunner.query(`ALTER TABLE "client_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-10T16:15:36.968Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "client_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03'`);
        await queryRunner.query(`ALTER TABLE "client_excel" RENAME COLUMN "file_name" TO "name"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" RENAME COLUMN "file_name" TO "name"`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" RENAME COLUMN "file_name" TO "name"`);
    }

}
