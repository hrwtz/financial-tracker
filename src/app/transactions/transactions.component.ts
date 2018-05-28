import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, Sort } from '@angular/material';

import { Transaction } from '../core/transaction';
import { SheetFetcherService } from '../core/sheet-fetcher.service';
import { LocalStorageService } from '../core/local-storage.service';

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

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private sheetFetcherService: SheetFetcherService,
		private localStorageService: LocalStorageService
	) {}

	/*
	 * Hook up paginator and sort to data source, disable empty sort, and hook data
	 * to dataSource and clear sort/pagination when new data comes in.
	 */
	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		this.disableEmptySort();

		this.resetDataSource();
	}

	/*
	 * Set isAlive to false so we can stop watching observers after the component
	 * is destroyed
	 */
	ngOnDestroy() {
		this.isAlive = false;
	}

	/*
	 * Hook data to dataSource and clear sort/pagination when new data comes in
	 */
	private resetDataSource() {
		this.sheetFetcherService.getObservables()
			.filter(isCompleted => isCompleted)
			.takeWhile(isCompleted => this.isAlive)
			.subscribe((isCompleted) => {
				this.dataSource.data = this.localStorageService.get('transactions');
				this.dataSource.sort.sort({
					id: 'date',
					start: 'desc',
					disableClear: false
				});
				this.dataSource.paginator.firstPage();
			});
	}

	/*
	 * When we get an empty sort event, update it so we sort by asc instead
	 */
	private disableEmptySort() {
		this.sort.sortChange
			.filter((sortChangeEvent: Sort) => !sortChangeEvent.direction)
			.subscribe((sortChangeEvent: Sort) => {
				this.dataSource.sort.sort({
					id: sortChangeEvent.active,
					start: 'asc',
					disableClear: false
				});
			});
	}
}
