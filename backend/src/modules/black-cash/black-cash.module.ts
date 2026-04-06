import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackCashTransaction } from './black-cash.entity';
import { BlackCashController } from './black-cash.controller';
import { BlackCashService } from './black-cash.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlackCashTransaction])],
  controllers: [BlackCashController],
  providers: [BlackCashService],
  exports: [BlackCashService],
})
export class BlackCashModule {}
