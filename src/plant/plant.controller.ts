import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { TypePackagingService } from './type_packinging.service';
import { CreateTypePackagingDto } from './dto/create_type_packaging';
import { CreateProductDispatchDto } from './dto/create_product_dispatch.dto';
import { ProductDispatchService } from './product_dispatch.service';
import { ControlProductService } from './control_product.service';
import { ControlProductDto } from './dto/control_product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('plant')
export class PlantController {
  constructor(
    private readonly typePackagingService: TypePackagingService,
    private readonly productDispatchService: ProductDispatchService,
    private readonly controlProductService: ControlProductService,
  ) {}

  // TypePackaging
  @Post('create-type-packaging')
  @Auth(ValidRoles.admin)
  createTypePackaging(@Body() createTypePackagingDto: CreateTypePackagingDto) {
    return this.typePackagingService.create(createTypePackagingDto);
  }

  @Get('type-packaging')
  findAllTypePackaging(@Query() paginationDto: PaginationDto) {
    return this.typePackagingService.findAll(paginationDto);
  }

  @Get('type-packaging/:id')
  findOneTypePackaging(@Param('id', ParseIntPipe) id: number) {
    return this.typePackagingService.findOne(id);
  }

  @Delete('type-packaging/:id')
  @Auth(ValidRoles.admin)
  removeTypePackaging(@Param('id', ParseIntPipe) id: number) {
    return this.typePackagingService.remove(id);
  }

  // ProductDispatch
  @Post('create-product-dispatch')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  createProductDispatch(
    @Body() createProductDispatchDto: CreateProductDispatchDto,
  ) {
    return this.productDispatchService.create(createProductDispatchDto);
  }

  @Get('product-dispatch')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  findAllProductDispatch(@Query() paginationDto: PaginationDto) {
    return this.productDispatchService.findAll(paginationDto);
  }

  @Get('product-dispatch/:id')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  findOneProductDispatch(@Param('id', ParseIntPipe) id: number) {
    return this.productDispatchService.findOne(id);
  }

  @Delete('product-dispatch/:id')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  removeProductDispatch(@Param('id', ParseIntPipe) id: number) {
    return this.productDispatchService.remove(id);
  }

  // Control product
  @Post('create-control-product')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  createControlProduct(
    @Body() controlProductDto: ControlProductDto,
    @GetUser() user: User,
  ) {
    return this.controlProductService.create(controlProductDto, user);
  }

  @Get('control-product')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  findAllControlProduct(@Query() paginationDto: PaginationDto) {
    return this.controlProductService.findAll(paginationDto);
  }

  @Get('control-product/:id')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  findOneControlProduct(@Param('id', ParseIntPipe) id: number) {
    return this.controlProductService.findOne(id);
  }

  @Delete('control-product/:id')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  removeControlProduct(@Param('id', ParseIntPipe) id: number) {
    return this.controlProductService.remove(id);
  }
}
