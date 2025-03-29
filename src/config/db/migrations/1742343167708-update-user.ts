import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1742343167708 implements MigrationInterface {
    name = 'UpdateUser1742343167708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.513Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.513Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.810Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.810Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.829Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:12:49.830Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:12:49.830Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:00:46.876Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:00:46.876Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:00:46.894Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:00:46.894Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:00:46.894Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:00:46.894Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
    }

}
