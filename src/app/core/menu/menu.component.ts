import { Component } from '@angular/core';

import { SheetFetcherService } from '../../core/sheet-fetcher.service'

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html'
})
export class MenuComponent {

	constructor(
		private sheetFetcherService: SheetFetcherService
	) {}

	/*
	 * Force refresh the data
	 */
	refreshData() {
		this.sheetFetcherService.fetchSheets(true);
	}
}
