import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SheetFetcherService } from './core/sheet-fetcher.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	progress = false;
	loaded = false;
	title = 'app';

	constructor(
		private sheetFetcherService: SheetFetcherService
	) {}

	ngOnInit() {
		this.sheetFetcherService.fetchSheets();

		this.sheetFetcherService.getObservables()
			.subscribe((completed) => {
				this.progress = !completed;
				this.loaded = completed;
			});
	}
}
