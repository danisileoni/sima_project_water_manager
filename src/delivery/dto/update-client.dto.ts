import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from './create-client.dto';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {}
