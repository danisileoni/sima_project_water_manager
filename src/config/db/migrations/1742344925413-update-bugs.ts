import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBugs1742344925413 implements MigrationInterface {
    name = 'UpdateBugs1742344925413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_e3c8fef52a79322295615c6b3b5"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "UQ_e3c8fef52a79322295615c6b3b5"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "typePackagingId"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "type_packaging_id" integer`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "UQ_1a1d88c7d835a13e7cf2e19249d" UNIQUE ("type_packaging_id")`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "vehicle_transfer_id" integer`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "UQ_567f8455ead8cd4584f0d386e1a" UNIQUE ("vehicle_transfer_id")`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "plant_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:42:07.229Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:42:07.229Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:42:07.533Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:42:07.533Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "created_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.552Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "updated_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.552Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "created_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "updated_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "created_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "updated_at" date NOT NULL DEFAULT '2025-03-19T00:42:07.553Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d" FOREIGN KEY ("type_packaging_id") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a" FOREIGN KEY ("vehicle_transfer_id") REFERENCES "vehicle_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1738b88dbeef4d2b2878bc9363b" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1738b88dbeef4d2b2878bc9363b"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "updated_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.838Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "created_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.838Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "updated_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.838Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "created_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.838Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "updated_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.837Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "created_at" text NOT NULL DEFAULT '2025-03-19T00:27:08.837Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "plant_id"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "UQ_567f8455ead8cd4584f0d386e1a"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "vehicle_transfer_id"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "UQ_1a1d88c7d835a13e7cf2e19249d"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "type_packaging_id"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "typePackagingId" integer`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "UQ_e3c8fef52a79322295615c6b3b5" UNIQUE ("typePackagingId")`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_e3c8fef52a79322295615c6b3b5" FOREIGN KEY ("typePackagingId") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
