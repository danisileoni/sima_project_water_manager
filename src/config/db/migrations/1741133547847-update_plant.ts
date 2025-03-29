import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlant1741133547847 implements MigrationInterface {
    name = 'UpdatePlant1741133547847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plant" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "ceiling" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.576Z'`);
        await queryRunner.query(`ALTER TABLE "ceiling" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.576Z'`);
        await queryRunner.query(`ALTER TABLE "floor" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.583Z'`);
        await queryRunner.query(`ALTER TABLE "floor" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.583Z'`);
        await queryRunner.query(`ALTER TABLE "openings" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.590Z'`);
        await queryRunner.query(`ALTER TABLE "openings" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.590Z'`);
        await queryRunner.query(`ALTER TABLE "shelves_pallets" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.596Z'`);
        await queryRunner.query(`ALTER TABLE "shelves_pallets" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.596Z'`);
        await queryRunner.query(`ALTER TABLE "equipment_container_sanitation" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.632Z'`);
        await queryRunner.query(`ALTER TABLE "equipment_container_sanitation" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.632Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.641Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.641Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.656Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.656Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.657Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.657Z'`);
        await queryRunner.query(`ALTER TABLE "control_post_operational" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.662Z'`);
        await queryRunner.query(`ALTER TABLE "control_post_operational" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.662Z'`);
        await queryRunner.query(`ALTER TABLE "control_pre_operational" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.667Z'`);
        await queryRunner.query(`ALTER TABLE "control_pre_operational" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.667Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "cleaning_disinfection_area_working" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "cleaning_disinfection_area_working" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "structure_hardware_utensils" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "structure_hardware_utensils" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "walls" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "walls" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.668Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-05T00:12:29.927Z'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-05T00:12:29.927Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04'`);
        await queryRunner.query(`ALTER TABLE "walls" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "walls" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "structure_hardware_utensils" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "structure_hardware_utensils" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "cleaning_disinfection_area_working" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "cleaning_disinfection_area_working" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04'`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04'`);
        await queryRunner.query(`ALTER TABLE "control_pre_operational" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "control_pre_operational" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.717Z'`);
        await queryRunner.query(`ALTER TABLE "control_post_operational" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.712Z'`);
        await queryRunner.query(`ALTER TABLE "control_post_operational" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.711Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.706Z'`);
        await queryRunner.query(`ALTER TABLE "product_dispatch" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.706Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.706Z'`);
        await queryRunner.query(`ALTER TABLE "vehicle_transfer" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.706Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.688Z'`);
        await queryRunner.query(`ALTER TABLE "control_product" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.688Z'`);
        await queryRunner.query(`ALTER TABLE "equipment_container_sanitation" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.678Z'`);
        await queryRunner.query(`ALTER TABLE "equipment_container_sanitation" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.678Z'`);
        await queryRunner.query(`ALTER TABLE "shelves_pallets" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.640Z'`);
        await queryRunner.query(`ALTER TABLE "shelves_pallets" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.640Z'`);
        await queryRunner.query(`ALTER TABLE "openings" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.633Z'`);
        await queryRunner.query(`ALTER TABLE "openings" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.633Z'`);
        await queryRunner.query(`ALTER TABLE "floor" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.626Z'`);
        await queryRunner.query(`ALTER TABLE "floor" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.626Z'`);
        await queryRunner.query(`ALTER TABLE "ceiling" ALTER COLUMN "updatedAt" SET DEFAULT '2025-03-04T23:25:09.618Z'`);
        await queryRunner.query(`ALTER TABLE "ceiling" ALTER COLUMN "createdAt" SET DEFAULT '2025-03-04T23:25:09.618Z'`);
        await queryRunner.query(`ALTER TABLE "plant" DROP COLUMN "isActive"`);
    }

}
