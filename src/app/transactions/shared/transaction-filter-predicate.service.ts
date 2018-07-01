import { Injectable } from '@angular/core';

import { Filter, FilterFn } from '../models/filter.model';
import { Transaction } from '../../core/models/transaction.model';
import { CategoryHashService } from '../../core/category-hash.service';

@Injectable()
export class TransactionFilterPredicateService {
	constructor(
		private categoryHashService: CategoryHashService
	) {}

	/*
	 * Returns the filterPredicate function to replace the default MatTableDataSource
	 * filterPredicate function. The new filterPredicate function takes in a transaction
	 * and filters in the form of a JSON string. It then checks if it matches any of our
	 * custom rules and if so filters off of them. If it does not match, it will do the
	 * check based on the standard filters.
	 */
	getFilterPredicate(): (data: Transaction, filtersJson: string) => boolean {
		return function(data: Transaction, filtersJson: string): boolean {
			const filters: Filter[] = JSON.parse(filtersJson);
			let matches = true;

			filters.forEach(filter => {
				let customFilterResult: boolean = null;

				this.customFilters.forEach(customFilter => {
					const result = customFilter(data, filter);

					if (result !== null) {
						customFilterResult = result || customFilterResult || false;
					}
				});
				if (customFilterResult !== null) {
					matches = customFilterResult;
				} else if (!this.checkStandardFilter(data, filter)) {
					matches = false;
				}
			});

			return matches;
		}.bind(this);
	}

	private customFilters: FilterFn[] = [
		/*
		 * If we are filtering for a category, and the filter category is a parent
		 * category, match any child categories.
		 */
		(data: Transaction, filter: Filter): boolean | null => {
			const parentCategoryHash = this.categoryHashService.getHash('parent');

			if (filter.field === 'category' && parentCategoryHash[filter.value] === filter.value) {
				return filter.value === parentCategoryHash[data['category']];
			}
			return null;
		},
		// When filtering for the amount, only filter for the absolute value of the amount.
		(data: Transaction, filter: Filter): boolean | null => {
			if (filter.field === 'amount' && data.amount < 0 && ['gte', 'lte'].includes(filter.operator)) {
				if (filter.operator === 'gte') {
					return Math.abs(data['amount']) > filter.value;
				} else if (filter.operator === 'lte') {
					return Math.abs(data['amount']) < filter.value;
				}
			}
			return null;
		}
	];

	/*
	 * Do the standard filter check. This checks for filters with operators or eq, gte,
	 * lte, and contains.
	 */
	private checkStandardFilter(data: Transaction, filter: Filter): boolean {
		return !(
			filter.operator === 'eq' && data[filter.field] !== filter.value ||
			filter.operator === 'gte' && data[filter.field] < filter.value ||
			filter.operator === 'lte' && data[filter.field] > filter.value ||
			(filter.operator === 'contains' && !data[filter.field].toLowerCase().includes(filter.value.toLowerCase()))
		);
	}
}
