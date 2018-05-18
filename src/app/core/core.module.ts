import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { MenuModule } from './menu/menu.module';
import { LocalStorageService } from './local-storage.service';
import { SheetFetcherService } from './sheet-fetcher.service';
import { SheetParserService } from './sheet-parser.service';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	exports: [
		MenuModule
	],
	providers: [
		LocalStorageService,
		SheetFetcherService,
		SheetParserService
	]
})
export class CoreModule {
	constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, 'CoreModule');
	}
}
