import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { MenuModule } from './menu/menu.module';
import { CategoryHashService } from './category-hash.service';
import { CustomValidatorsService } from './custom-validators.service';
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
		CategoryHashService,
		CustomValidatorsService,
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
