import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressRelationToClient1751941462190 implements MigrationInterface {
    name = 'AddAddressRelationToClient1751941462190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_6e6c7c79fbf5ab39520cd1723e2" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_6e6c7c79fbf5ab39520cd1723e2" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_6e6c7c79fbf5ab39520cd1723e2"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_6e6c7c79fbf5ab39520cd1723e2"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "addressId"`);
    }

}
