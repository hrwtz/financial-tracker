import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Filter } from '../models/filter.model';

@Component({
	selector: 'app-filter-chips',
	templateUrl: './filter-chips.component.html'
})
export class FilterChipsComponent {
	@Input() filters: Filter[];
	@Output() change = new EventEmitter<null>();

	/*
	 * Removes a filter from the filters array and emits the change event.
	 */
	removeFilter(filter: Filter): void {
		const index = this.filters.indexOf(filter);

		if (index !== -1) {
			this.filters.splice(index, 1);
			this.change.emit();
		}
	}
}
