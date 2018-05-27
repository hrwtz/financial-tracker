import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Sheet, SheetResponse, SheetSubjects } from './sheet';
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
	private subjects: SheetSubjects = {};

	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService,
		private sheetParserService: SheetParserService
	) {
		this.sheets.forEach(sheet => {
			this.subjects[sheet.id] = new ReplaySubject(1);
		});
	}

	/*
	 * If sheets were not yet fetched this month or if force variable is passed in, calls
	 * google sheets and stores values for each sheet. Else sends the complete message for
	 * each of the sheet subjects.
	 */
	fetchSheets(forceRefresh?: boolean): void {
		const lastFetched = new Date(this.localStorageService.get('last-fetched')),
			today = new Date(),
			firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		if (lastFetched === null || lastFetched < firstOfMonth || forceRefresh) {
			this.fetchAndStoreSheets();
		} else {
			this.sheets.forEach(sheet => {
				this.subjects[sheet.id].next(true);
			});
		}
	}

	/*
	 * Returns an observable of all the sheet subjects. The observable emits a
	 * boolean of isCompleted. If false, the observable is in progress. If not,
	 * it has completed.
	 *
	 * @return `Observable<boolean>` of observables
	 */
	getObservables(): Observable<boolean> {
		const observables = Object.values(this.subjects);

		return Observable.zip.apply(Observable.zip, observables).map(result => result[0]);
	}

	/*
	 * Loops through each sheet saving the data and storing the observables.
	 * For each sheet subject, emits the in progress message. Then it makes
	 * the call to the server to grab the data. Once the data is parsed and
	 * saved, it emits the completed message. Then all subjects are subscribed
	 * to and the last-fetched time is set.
	 */
	private fetchAndStoreSheets() {
		const httpObservables = [];

		this.sheets.forEach(sheet => {
			this.subjects[sheet.id].next(false);

			const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + environment.spreadsheetId + '/values/' + sheet.name + '?key=' + environment.apiKey;

			((sheetSafe) => {
				httpObservables.push(
					this.http.get(url)
						.do((response: SheetResponse) => {
							const parsedData = sheetSafe.parser(response.values);

							this.localStorageService.set(sheetSafe.id, parsedData);
							this.subjects[sheetSafe.id].next(true);
						})
				);
			})(sheet);
		});

		Observable.forkJoin(httpObservables)
			.subscribe((response) => {
				this.localStorageService.set('last-fetched', new Date().toString());
			});
	}
}
