import { Controller, Get, Query } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceMetricsDto } from './dto/performance-metrics.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('sales')
  @Auth(ValidRoles.admin, ValidRoles.delivery)
  getSales(@Query() query: PerformanceMetricsDto, @GetUser() user: User) {
    return this.performanceService.getSales(query, user);
  }

  @Get('new-clients')
  @Auth(ValidRoles.admin, ValidRoles.delivery)
  getNewClients(@Query() query: PerformanceMetricsDto, @GetUser() user: User) {
    return this.performanceService.getNewClients(query, user);
  }

  @Get('dispatches')
  @Auth(ValidRoles.admin, ValidRoles.delivery)
  getCargas(@Query() query: PerformanceMetricsDto, @GetUser() user: User) {
    return this.performanceService.getCargas(query, user);
  }
}
