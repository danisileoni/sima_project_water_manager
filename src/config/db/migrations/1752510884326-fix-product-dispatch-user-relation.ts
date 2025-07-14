import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProductDispatchUserRelation1752510884326 implements MigrationInterface {
    name = 'FixProductDispatchUserRelation1752510884326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_1738b88dbeef4d2b2878bc9363b"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "plant_id"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "batch_num"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "batch_num" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "UQ_1849ade3ee13d6760507b8dc9fe" UNIQUE ("batch_num")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "batch_num"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "batch_num" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD CONSTRAINT "FK_b9842fb56d90f63b99f1305678c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "FK_b9842fb56d90f63b99f1305678c"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "batch_num"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "batch_num" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "date" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "street" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT '{user}'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP CONSTRAINT "UQ_1849ade3ee13d6760507b8dc9fe"`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "batch_num"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "batch_num" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "updated_at" date NOT NULL DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ADD "created_at" date NOT NULL DEFAULT '2025-03-19'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "plant_id" integer`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_1738b88dbeef4d2b2878bc9363b" FOREIGN KEY ("plant_id") REFERENCES "plant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
