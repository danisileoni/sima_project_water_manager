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
import { FilterDto } from '../common/dtos/filter.dto';
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
  findAllTypePackaging(@Query() filterDto: FilterDto) {
    return this.typePackagingService.findAll(filterDto);
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
    @GetUser() user: User,
  ) {
    return this.productDispatchService.create(
      createProductDispatchDto,
      user.id,
    );
  }

  @Get('product-dispatch')
  @Auth(ValidRoles.plant, ValidRoles.admin)
  findAllProductDispatch(@Query() filterDto: FilterDto) {
    return this.productDispatchService.findAll(filterDto);
  }

  @Get('product-dispatch/for-user')
  @Auth(ValidRoles.delivery, ValidRoles.admin)
  findDispatchForUser(@Query() filterDto: FilterDto, @GetUser() user: User) {
    return this.productDispatchService.findDispatchForUser(filterDto, user.id);
  }

  @Get('product-dispatch/findOne/:id')
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
  findAllControlProduct(@Query() filterDto: FilterDto) {
    return this.controlProductService.findAll(filterDto);
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
