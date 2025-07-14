import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressEntity1751941228611 implements MigrationInterface {
    name = 'AddAddressEntity1751941228611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "street" text, "state_or_province" text, "city" text, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
