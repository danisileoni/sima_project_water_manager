import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDateControlProduct41743278195713 implements MigrationInterface {
    name = 'ChangeDateControlProduct41743278195713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drums_quantity" DROP CONSTRAINT "FK_26e5421f36173f4995622f1cb38"`);
        await queryRunner.query(`ALTER TABLE "drums_quantity" DROP CONSTRAINT "UQ_26e5421f36173f4995622f1cb38"`);
        await queryRunner.query(`ALTER TABLE "drums_quantity" DROP COLUMN "control_product_id"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "drums_quantity_id" integer`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "UQ_1ae4214ec7a1e6e15740cdb2a81" UNIQUE ("drums_quantity_id")`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:56:37.268Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:56:37.268Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:56:37.283Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:56:37.283Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:56:37.286Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:56:37.286Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29T19:56:37.286Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29T19:56:37.286Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81" FOREIGN KEY ("drums_quantity_id") REFERENCES "drums_quantity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "FK_1ae4214ec7a1e6e15740cdb2a81"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-29'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "UQ_1ae4214ec7a1e6e15740cdb2a81"`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "drums_quantity_id"`);
        await queryRunner.query(`ALTER TABLE "drums_quantity" ADD "control_product_id" integer`);
        await queryRunner.query(`ALTER TABLE "drums_quantity" ADD CONSTRAINT "UQ_26e5421f36173f4995622f1cb38" UNIQUE ("control_product_id")`);
        await queryRunner.query(`ALTER TABLE "drums_quantity" ADD CONSTRAINT "FK_26e5421f36173f4995622f1cb38" FOREIGN KEY ("control_product_id") REFERENCES "control_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
