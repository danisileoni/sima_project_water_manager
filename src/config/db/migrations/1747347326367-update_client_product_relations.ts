import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClientProductRelations1747347326367 implements MigrationInterface {
    name = 'UpdateClientProductRelations1747347326367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_product" ("id" SERIAL NOT NULL, "quantity" numeric NOT NULL, "batch_of_product" text NOT NULL, "typePackagingId" integer, "clientId" integer, CONSTRAINT "PK_035adceb189db0b4daf9050e86f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_product" ADD CONSTRAINT "FK_4356af9a52b90e3d57a0c97581e" FOREIGN KEY ("typePackagingId") REFERENCES "type_packaging"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_product" ADD CONSTRAINT "FK_99defa1b24471e38f4f6fcd2dc2" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_product" DROP CONSTRAINT "FK_99defa1b24471e38f4f6fcd2dc2"`);
        await queryRunner.query(`ALTER TABLE "client_product" DROP CONSTRAINT "FK_4356af9a52b90e3d57a0c97581e"`);
        await queryRunner.query(`DROP TABLE "client_product"`);
    }

}
