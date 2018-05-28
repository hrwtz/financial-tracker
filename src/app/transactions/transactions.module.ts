import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TransactionsComponent } from './transactions.component';

@NgModule({
	imports: [
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule
	],
	providers: [
	],
	declarations: [
		TransactionsComponent,
	],
	exports: [
		TransactionsComponent
	]
})
export class TransactionsModule { }
