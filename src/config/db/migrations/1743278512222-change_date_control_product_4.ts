import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDateControlProduct41743278512222 implements MigrationInterface {
    name = 'ChangeDateControlProduct41743278512222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:01:53.815Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:01:53.815Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:01:53.829Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:01:53.829Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:01:53.833Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:01:53.833Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:01:53.833Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:01:53.833Z'`);
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
