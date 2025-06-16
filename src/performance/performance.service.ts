import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceMetricsDto } from './dto/performance-metrics.dto';
import { ProductDispatch } from '../plant/entities/product_dispatch.entity';
import { ControlProduct } from '../plant/entities/control_product.entity';
import { Client } from '../delivery/entities/client.entity';
import { Repository, Between } from 'typeorm';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(ProductDispatch)
    private readonly productDispatchRepository: Repository<ProductDispatch>,
    @InjectRepository(ControlProduct)
    private readonly controlProductRepository: Repository<ControlProduct>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  private getDateRange(dto: PerformanceMetricsDto): {
    startDate?: Date;
    endDate?: Date;
  } {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dto.period && dto.period !== 'all') {
      endDate = dto.endDate ? new Date(dto.endDate) : new Date();
      // endDate al final del día
      endDate.setHours(23, 59, 59, 999);
      switch (dto.period) {
        case 'week':
          startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 6);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(endDate);
          startDate.setMonth(endDate.getMonth() - 1);
          startDate.setDate(startDate.getDate() + 1); // para incluir el día actual
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'year':
          startDate = new Date(endDate);
          startDate.setFullYear(endDate.getFullYear() - 1);
          startDate.setDate(startDate.getDate() + 1); // para incluir el día actual
          startDate.setHours(0, 0, 0, 0);
          break;
      }
    } else if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(dto.endDate);
      endDate.setHours(23, 59, 59, 999);
    }
    return { startDate, endDate };
  }

  async getSales(dto: PerformanceMetricsDto, user) {
    const { startDate, endDate } = this.getDateRange(dto);
    console.log(`Fetching cargas from ${startDate} to ${endDate}`);

    let query = this.clientRepository
      .createQueryBuilder('client')
      .select('SUM(client.quantity)', 'total')
      .where('client.userId = :userId', { userId: user.id });

    if (startDate && endDate) {
      query = query.andWhere('client.created_at BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    const ventas = Number(result.total) || 0;
    return { ventas };
  }

  async getNewClients(dto: PerformanceMetricsDto, user) {
    const { startDate, endDate } = this.getDateRange(dto);
    console.log(`Fetching cargas from ${startDate} to ${endDate}`);

    // QueryBuilder para clientes únicos (reales)
    let query = this.clientRepository
      .createQueryBuilder('client')
      .distinctOn([
        'client.name_or_company',
        'client.dni_cuit',
        'client.contact',
      ])
      .select([
        'client.id',
        'client.name_or_company',
        'client.dni_cuit',
        'client.contact',
      ])
      .where('client.userId = :userId', { userId: user.id });

    if (startDate && endDate) {
      query = query.andWhere('client.created_at BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    // Ejecutar y contar resultados únicos
    const clientesUnicos = await query.getRawMany();
    return { nuevosClientes: clientesUnicos.length };
  }

  async getCargas(dto: PerformanceMetricsDto, user) {
    const { startDate, endDate } = this.getDateRange(dto);
    console.log(`Fetching cargas from ${startDate} to ${endDate}`);
    const where: any = { user_dispatch_id: user.id };
    if (startDate && endDate) {
      where.created_at = Between(startDate, endDate);
    }
    const cargas = await this.productDispatchRepository.count({
      where,
    });
    console.log(
      `[CARGAS] startDate: ${startDate}, endDate: ${endDate}, total: ${cargas}`,
    );
    return { cargas };
  }
}
