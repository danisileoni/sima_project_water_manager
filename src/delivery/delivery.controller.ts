import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Auth(ValidRoles.delivery, ValidRoles.admin)
  create(@Body() createClientDto: CreateClientDto, @GetUser() user: User) {
    return this.deliveryService.create(createClientDto, user);
  }

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.deliveryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }
}
