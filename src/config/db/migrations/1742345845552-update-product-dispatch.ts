import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductDispatch1742345845552 implements MigrationInterface {
    name = 'UpdateProductDispatch1742345845552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP CONSTRAINT "FK_15e4f3d4c03413d707b54391345"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "productDispatchId"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "type_packaging_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.356Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.356Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.650Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.651Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.669Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.669Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.669Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.669Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.669Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.670Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:57:27.670Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:57:27.670Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d" FOREIGN KEY ("type_packaging_id") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "type_packaging_id"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "productDispatchId" integer`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD CONSTRAINT "FK_15e4f3d4c03413d707b54391345" FOREIGN KEY ("productDispatchId") REFERENCES "product_dispatch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
