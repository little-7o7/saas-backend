import { BaseEntity } from '../../common/entities/base.entity';
export declare class Employee extends BaseEntity {
    name: string;
    phone: string;
    position: string;
    dailyRate: number;
    isActive: boolean;
}
