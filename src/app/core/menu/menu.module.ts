import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { MenuComponent } from './menu.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatMenuModule,
		MatIconModule
	],
	declarations: [
		MenuComponent
	],
	exports: [
		MenuComponent
	]
})
export class MenuModule { }
