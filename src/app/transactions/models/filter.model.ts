import { Transaction } from '../../core/models/transaction.model';

export interface Filter {
	field: string;
	operator: 'eq'|'gte'|'lte'|'contains';
	value: any;
}

export interface FilterValues {
	[key: string]: {
		[key: string]: any
	};
}

export interface FilterFn {
	(data: Transaction, filter: Filter): boolean | null
}
