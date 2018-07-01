import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from '../shared/shared.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsFilterComponent } from './transactions-filter/transactions-filter.component';
import { FilterChipsComponent } from './filter-chips/filter-chips.component';
import { TransactionFilterPredicateService } from './shared/transaction-filter-predicate.service';
import { TransactionFilterValuesService } from './shared/transaction-filter-values.service'

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatChipsModule,
		MatSelectModule,
		MatDatepickerModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatSortModule,
		MatTableModule,
		SharedModule
	],
	providers: [
		TransactionFilterPredicateService,
		TransactionFilterValuesService
	],
	declarations: [
		TransactionsComponent,
		FilterChipsComponent,
		TransactionsFilterComponent
	],
	entryComponents: [
		TransactionsFilterComponent
	],
	exports: [
		TransactionsComponent
	]
})
export class TransactionsModule { }
