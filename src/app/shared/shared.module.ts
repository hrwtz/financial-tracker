import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuModule } from './menu/menu.module';

@NgModule({
	imports: [
		CommonModule
	],
	exports: [
		MenuModule
	]
})
export class SharedModule { }
