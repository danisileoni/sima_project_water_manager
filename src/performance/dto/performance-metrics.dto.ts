import { IsOptional, IsDateString, IsIn } from 'class-validator';

export class PerformanceMetricsDto {
  @IsOptional()
  @IsIn(['all', 'week', 'month', 'year'])
  period?: 'all' | 'week' | 'month' | 'year';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
