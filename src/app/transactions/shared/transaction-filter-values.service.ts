import { Injectable } from '@angular/core';
import forOwn from 'lodash/forOwn';

import { Filter, FilterValues } from '../models/filter.model';

@Injectable()
export class TransactionFilterValuesService {
	/*
	 * Transform the values object passed in into a filters array
	 */
	getFiltersFromValues(values: FilterValues): Filter[] {
		const filters: Filter[] = [];

		forOwn(values, (filter: {[key: string]: any}, field: string) => {
			forOwn(filter, (value: any, operator: 'eq'|'gte'|'lte'|'contains') => {
				if (value) {
					filters.push({
						field: field,
						operator: operator,
						value: value
					});
				}
			});
		});

		return filters;	
	}

	/*
	 * Transform the filters array passed in into a FilterValues object that can be used
	 * by a mode.
	 */
	getValuesFromFilters(filters: Filter[]): FilterValues {
		const values = {};

		/*
		 * Set up base objects on values object. Set category and categoryType eq property
		 * as an empty string so the select dropdown picks it up as the default value
		 */
		['date', 'description', 'categoryType', 'category', 'amount'].forEach(key => {
			values[key] = {};
			if (['category', 'categoryType'].includes(key)) {
				values[key].eq = '';
			}
		});

		// Set the rest of the values from the filters array passed in
		filters.forEach(filter => {
			values[filter.field] = values[filter.field] || {};
			values[filter.field][filter.operator] = filter.value;
		});

		return values;
	}
}
