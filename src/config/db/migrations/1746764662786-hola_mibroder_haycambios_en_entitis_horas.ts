import { MigrationInterface, QueryRunner } from "typeorm";

export class HolaMibroderHaycambiosEnEntitisHoras1746764662786 implements MigrationInterface {
    name = 'HolaMibroderHaycambiosEnEntitisHoras1746764662786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "client_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "client_excel" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "client_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "client_excel" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "client_excel" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "client_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "client_excel" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product_excel" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "dispatch_product_excel" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "control_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "control_product" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "updated_at" date NOT NULL DEFAULT '2025-04-10'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ADD "created_at" date NOT NULL DEFAULT '2025-04-10'`);
    }

}
