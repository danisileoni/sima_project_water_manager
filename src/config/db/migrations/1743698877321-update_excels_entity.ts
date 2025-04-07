import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExcelsEntity1743698877321 implements MigrationInterface {
    name = 'UpdateExcelsEntity1743698877321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dispatch_product_excel" ("id" SERIAL NOT NULL, "name" text NOT NULL, "path" text NOT NULL, "date" date NOT NULL, "file_id" text NOT NULL, "created_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.220Z', "updated_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.220Z', CONSTRAINT "PK_e46a9a0da1dda8ff473f024b043" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_excel" ("id" SERIAL NOT NULL, "name" text NOT NULL, "path" text NOT NULL, "date" date NOT NULL, "file_id" text NOT NULL, "created_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.443Z', "updated_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.443Z', CONSTRAINT "PK_b35812a1387fcb0900c014ba5a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "control_product_excel" ("id" SERIAL NOT NULL, "name" text NOT NULL, "path" text NOT NULL, "date" date NOT NULL, "file_id" text NOT NULL, "created_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.659Z', "updated_at" date NOT NULL DEFAULT '2025-04-03T16:47:59.659Z', CONSTRAINT "PK_84465c7b65a2d335fa82c6becfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03T16:47:58.947Z'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03T16:47:58.947Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03T16:47:58.962Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03T16:47:58.962Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03T16:47:58.976Z'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03T16:47:58.976Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03T16:47:58.980Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03T16:47:58.980Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-04-03T16:47:58.980Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-04-03T16:47:58.980Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "created_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "type_packaging" ALTER COLUMN "created_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "created_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "created_at" SET DEFAULT '2025-03-31'`);
        await queryRunner.query(`DROP TABLE "control_product_excel"`);
        await queryRunner.query(`DROP TABLE "client_excel"`);
        await queryRunner.query(`DROP TABLE "dispatch_product_excel"`);
    }

}
