import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnDeleteCascade1743279554045 implements MigrationInterface {
    name = 'AddOnDeleteCascade1743279554045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d"`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:19:15.606Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:19:15.606Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:19:15.620Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:19:15.620Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:19:15.623Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:19:15.623Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T20:19:15.623Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T20:19:15.623Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81" FOREIGN KEY ("drums_quantity_id") REFERENCES "drums_quantity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d" FOREIGN KEY ("type_packaging_id") REFERENCES "type_packaging"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a" FOREIGN KEY ("vehicle_transfer_id") REFERENCES "vehicle_transfer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d"`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1a1d88c7d835a13e7cf2e19249d" FOREIGN KEY ("type_packaging_id") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_567f8455ead8cd4584f0d386e1a" FOREIGN KEY ("vehicle_transfer_id") REFERENCES "vehicle_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81" FOREIGN KEY ("drums_quantity_id") REFERENCES "drums_quantity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
