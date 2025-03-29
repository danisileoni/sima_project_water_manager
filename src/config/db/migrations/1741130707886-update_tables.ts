import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1741130707886 implements MigrationInterface {
    name = 'UpdateTables1741130707886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ceiling" ("id" SERIAL NOT NULL, "treatment" text NOT NULL, "products" text NOT NULL, "date" text NOT NULL, "responsible" text NOT NULL, "entrustedReview" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.618Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.618Z', CONSTRAINT "PK_2e3f33476ffc8eabc38e813d1f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "floor" ("id" SERIAL NOT NULL, "treatment" text NOT NULL, "products" text NOT NULL, "date" text NOT NULL, "responsible" text NOT NULL, "entrustedReview" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.626Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.626Z', CONSTRAINT "PK_16a0823530c5b0dd226b8a96ee1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "openings" ("id" SERIAL NOT NULL, "treatment" text NOT NULL, "products" text NOT NULL, "date" text NOT NULL, "responsible" text NOT NULL, "entrustedReview" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.633Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.633Z', CONSTRAINT "PK_52465524569a0b0e856a64eb48b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shelves_pallets" ("id" SERIAL NOT NULL, "treatment" text NOT NULL, "products" text NOT NULL, "date" text NOT NULL, "responsible" text NOT NULL, "entrustedReview" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.640Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.640Z', CONSTRAINT "PK_11bef1cdf7638266cb0060b82ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cleaning_container" ("id" SERIAL NOT NULL, "agentCleaning" text NOT NULL, "time" text NOT NULL, "rinse" boolean NOT NULL, CONSTRAINT "PK_c74c4a6c4ddc4ab49637a7f245a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "disinfection_container" ("id" SERIAL NOT NULL, "agentDisinfection" text NOT NULL, "time" text NOT NULL, "rinse" boolean NOT NULL, CONSTRAINT "PK_e10ec2a1aadc0188ed21d06483c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment_container_sanitation" ("id" SERIAL NOT NULL, "dateOfStorage" text NOT NULL, "tank" numeric NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.678Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.678Z', CONSTRAINT "PK_f942859e72dd760cb9d12c5f8dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drums_quantity" ("id" SERIAL NOT NULL, "quantityEnter" numeric NOT NULL, "quantityOut" numeric NOT NULL, CONSTRAINT "PK_b1f96231b0d3197603094472f7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "control_product" ("id" SERIAL NOT NULL, "batchNum" numeric NOT NULL, "responsible" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.688Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.688Z', CONSTRAINT "PK_892664cbb1de4ea60dd8a9b63c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "type_packaging" ("id" SERIAL NOT NULL, "packaging" text NOT NULL, "size" numeric NOT NULL, CONSTRAINT "PK_b063fc81c41f6f5e0e3fbfef656" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle_transfer" ("id" SERIAL NOT NULL, "vehicle" text NOT NULL, "numDomain" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.706Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.706Z', CONSTRAINT "PK_38faf9e95ff6a0cbab71c2ebcd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_dispatch" ("id" SERIAL NOT NULL, "date" text NOT NULL, "batchNum" numeric NOT NULL, "quantity" numeric NOT NULL, "numDomain" text NOT NULL, "responsible" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.706Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.706Z', "typePackagingId" integer, CONSTRAINT "REL_e3c8fef52a79322295615c6b3b" UNIQUE ("typePackagingId"), CONSTRAINT "PK_1e309652e1b9ca45be61676c012" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "control_post_operational" ("id" SERIAL NOT NULL, "date" text NOT NULL, "hours" text NOT NULL, "operationCarriedOut" boolean NOT NULL, "responsible" text NOT NULL, "signature" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.711Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.712Z', CONSTRAINT "PK_708e65f99f96064b84eeb48dafb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "control_pre_operational" ("id" SERIAL NOT NULL, "date" text NOT NULL, "hours" text NOT NULL, "operationCarriedOut" boolean NOT NULL, "responsible" text NOT NULL, "signature" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', CONSTRAINT "PK_3a3daea1633d694d1c7aab56de6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plant" ("id" SERIAL NOT NULL, "createdAt" date NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', "updatedAt" date NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', CONSTRAINT "PK_97e1eb0d045aadea59401ece5ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cleaning_disinfection_area_working" ("id" SERIAL NOT NULL, "area" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', CONSTRAINT "PK_33daf85ebdbd95de07050735444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "structure_hardware_utensils" ("id" SERIAL NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', CONSTRAINT "PK_0871cc9e791cf079e3dcf0cc97e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "walls" ("id" SERIAL NOT NULL, "treatment" text NOT NULL, "products" text NOT NULL, "date" text NOT NULL, "responsible" text NOT NULL, "entrustedReview" text NOT NULL, "observations" text NOT NULL, "createdAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', "updatedAt" text NOT NULL DEFAULT '2025-03-04T23:25:09.717Z', CONSTRAINT "PK_c71c893c7abe2b1525c8793d7f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "surname" text NOT NULL, "email" text NOT NULL, "dni" numeric NOT NULL, "password" text NOT NULL, "createdAt" date NOT NULL DEFAULT '2025-03-04T23:25:09.978Z', "updatedAt" date NOT NULL DEFAULT '2025-03-04T23:25:09.978Z', "role" text array NOT NULL DEFAULT '{user}', "isActive" boolean NOT NULL DEFAULT true, "hashRefreshToken" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_027941f32603b418d9bf0db0e82" UNIQUE ("dni"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ADD CONSTRAINT "FK_e3c8fef52a79322295615c6b3b5" FOREIGN KEY ("typePackagingId") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_dispatch" DROP CONSTRAINT "FK_e3c8fef52a79322295615c6b3b5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "walls"`);
        await queryRunner.query(`DROP TABLE "structure_hardware_utensils"`);
        await queryRunner.query(`DROP TABLE "cleaning_disinfection_area_working"`);
        await queryRunner.query(`DROP TABLE "plant"`);
        await queryRunner.query(`DROP TABLE "control_pre_operational"`);
        await queryRunner.query(`DROP TABLE "control_post_operational"`);
        await queryRunner.query(`DROP TABLE "product_dispatch"`);
        await queryRunner.query(`DROP TABLE "vehicle_transfer"`);
        await queryRunner.query(`DROP TABLE "type_packaging"`);
        await queryRunner.query(`DROP TABLE "control_product"`);
        await queryRunner.query(`DROP TABLE "drums_quantity"`);
        await queryRunner.query(`DROP TABLE "equipment_container_sanitation"`);
        await queryRunner.query(`DROP TABLE "disinfection_container"`);
        await queryRunner.query(`DROP TABLE "cleaning_container"`);
        await queryRunner.query(`DROP TABLE "shelves_pallets"`);
        await queryRunner.query(`DROP TABLE "openings"`);
        await queryRunner.query(`DROP TABLE "floor"`);
        await queryRunner.query(`DROP TABLE "ceiling"`);
    }

}
