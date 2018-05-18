import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { Sheet, SheetResponse, SheetPromises } from './sheet';
import { LocalStorageService } from './local-storage.service';
import { SheetParserService } from './sheet-parser.service';

@Injectable()
export class SheetFetcherService {
	private sheets: Sheet[] = [{
		name: 'Transactions',
		id: 'transactions',
		parser: this.sheetParserService.parseTransactions.bind(this.sheetParserService)
	},
	{
		name: 'Categories',
		id: 'categories',
		parser: this.sheetParserService.parseCategories.bind(this.sheetParserService)
	},
	{
		name: 'Manual Data',
		id: 'manual-data',
		parser: this.sheetParserService.parseManualData.bind(this.sheetParserService)
	}];

	private promises: SheetPromises;

	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService,
		private sheetParserService: SheetParserService
	) {}

	/*
	 * If sheets were not yet fetched this month or if force variable is passed in, calls
	 * google sheets and stores values for each sheet.
	 */
	fetchSheets(forceRefresh?: boolean): void {
		const lastFetched = new Date(this.localStorageService.get('last-fetched')),
			today = new Date(),
			firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		if (lastFetched === null || lastFetched < firstOfMonth || forceRefresh) {
			this.fetchAndStoreSheets();
		}
	}

	/*
	 * Loops through each sheet saving the data and storing the observables.
	 */
	private fetchAndStoreSheets() {
		this.promises = {};

		this.sheets.forEach(sheet => {
			const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + environment.spreadsheetId + '/values/' + sheet.name + '?key=' + environment.apiKey;

			this.promises[sheet.id] = this.http.get(url).do((response: SheetResponse) => {
				const parsedData = sheet.parser(response.values);

				this.localStorageService.set(sheet.id, parsedData);
			});
		});

		Observable
			.forkJoin(Object.values(this.promises))
			.subscribe((response) => {
				this.localStorageService.set('last-fetched', new Date().toString());
			});
	}
}
