import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable, Sort, MatDialog } from '@angular/material';

import { Filter } from './models/filter.model';
import { Transaction } from '../core/models/transaction.model';
import { SheetFetcherService } from '../core/sheet-fetcher.service';
import { LocalStorageService } from '../core/local-storage.service';
import { TransactionFilterPredicateService } from './shared/transaction-filter-predicate.service';
import { TransactionsFilterComponent } from './transactions-filter/transactions-filter.component';

@Component({
	selector: 'app-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: [
		'./transactions.component.css'
	]
})
export class TransactionsComponent implements OnInit, OnDestroy {
	private isAlive = true;
	displayedColumns = ['date', 'description', 'category', 'amount'];
	dataSource = new MatTableDataSource<Transaction>();
	filters: Filter[] = [];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private dialog: MatDialog,
		private sheetFetcherService: SheetFetcherService,
		private localStorageService: LocalStorageService,
		private transactionFilterPredicateService: TransactionFilterPredicateService
	) {}

	/*
	 * Hook up paginator and sort to data source, disable empty sort, and hook data
	 * to dataSource and clear sort/pagination when new data comes in.
	 */
	ngOnInit(): void {
		this.dataSource.filterPredicate = this.transactionFilterPredicateService.getFilterPredicate();
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		this.disableEmptySort();

		this.resetDataSource();
	}

	/*
	 * Set isAlive to false so we can stop watching observers after the component
	 * is destroyed
	 */
	ngOnDestroy(): void {
		this.isAlive = false;
	}

	/*
	 * Open the filter dialog and pass in the filters array. On dialog close, update
	 * the filters set on this component and on the dataSource.
	 */
	showFilterDialog(): void {
		const dialogRef = this.dialog.open(TransactionsFilterComponent, {
			width: '425px',
			data: {
				filters: this.filters.slice()
			}
		});

		dialogRef.afterClosed().subscribe(filters => {
			const changed = this.getSerializedValue(filters) !== this.getSerializedValue(this.filters);

			if (filters) {
				this.filters = filters;
			}
			if (changed) {
				this.dataSource.filter = JSON.stringify(this.filters);
				this.resetDataSourceOptions();
			}
		});
	}

	/*
	 * When the filter chips are changed (aka, one is removed), update the dataSource
	 * filter and reset the dataSource options.
	 */
	chipChange(): void {
		this.dataSource.filter = JSON.stringify(this.filters);
		this.resetDataSourceOptions();
	}

	/*
	 * Hook data to dataSource and clear sort/pagination when new data comes in
	 */
	private resetDataSource(): void {
		this.sheetFetcherService.getObservables()
			.filter(isCompleted => isCompleted)
			.takeWhile(isCompleted => this.isAlive)
			.subscribe((isCompleted) => this.resetDataSourceOptions(true));
	}

	/*
	 * Reset the sorting and pagination on the dataSource. If new data is passed in,
	 * update the data on the dataSource.
	 */
	private resetDataSourceOptions(refreshData?): void {
		if (refreshData) {
			this.dataSource.data = this.localStorageService.get('transactions');
		}

		const sortable: MatSortable = {
			id: 'date',
			start: 'desc',
			disableClear: true
		};

		if (this.dataSource.sort.getNextSortDirection(sortable) === 'desc') {
			this.dataSource.sort.sort(sortable);
		}
		this.dataSource.paginator.firstPage();
	}

	/*
	 * When we get an empty sort event, update it so we sort by asc instead
	 */
	private disableEmptySort(): void {
		this.dataSource.sort.sortChange
			.filter((sortChangeEvent: Sort) => !sortChangeEvent.direction)
			.subscribe((sortChangeEvent: Sort) => {
				this.dataSource.sort.sort({
					id: sortChangeEvent.active,
					start: 'asc',
					disableClear: false
				});
			});
	}

	/*
	 * Serialized an array of filters so we can compare if two arrays are the same
	 */
	private getSerializedValue(filters: Filter[]): string {
		const sortedFilters = filters.slice().sort((a, b) => {
			if (a.field < b.field) {
				return -1;
			} else if (a.field > b.field) {
				return 1;
			}
			return 0;
		});

		return JSON.stringify(sortedFilters);
	}
}
