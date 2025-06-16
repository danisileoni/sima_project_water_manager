import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FilterDto } from 'src/common/dtos/filter.dto';
import { FilterUniqueClientsDto } from './dto/filter-unique-clients.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Auth(ValidRoles.delivery, ValidRoles.admin)
  create(@Body() createClientDto: CreateClientDto, @GetUser() user: User) {
    return this.deliveryService.create(createClientDto, user);
  }

  @Get()
  findAll(@Query() filterDto: FilterDto) {
    return this.deliveryService.findAll(filterDto);
  }

  @Get('client')
  @Auth(ValidRoles.delivery, ValidRoles.admin)
  findAllByClientId(@Query() filterDto: FilterDto, @GetUser() user: User) {
    return this.deliveryService.findAllByClientId(filterDto, user);
  }

  @Get('drive/files')
  @Auth(ValidRoles.admin)
  listDriveFiles() {
    return this.deliveryService.listDriveFiles();
  }

  @Get('unique')
  @Auth(ValidRoles.delivery, ValidRoles.admin)
  findUniqueClients(
    @Query() filterDto: FilterUniqueClientsDto,
    @GetUser() user: User,
  ) {
    return this.deliveryService.findUniqueClients(filterDto, user);
  }

  @Get('drive/check/:fileId')
  @Auth(ValidRoles.admin)
  checkDriveFile(@Param('fileId') fileId: string) {
    return this.deliveryService.checkDriveFile(fileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }
}
