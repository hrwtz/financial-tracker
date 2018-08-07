import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import find from 'lodash/find';
import * as startOfToday from 'date-fns/start_of_today';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FilterValues } from '../models/filter.model';
import { TransactionFilterValuesService } from '../shared/transaction-filter-values.service'
import { Categories } from '../../core/models/category.model';
import { LocalStorageService } from '../../core/local-storage.service';
import { CustomValidatorsService, CompareControlsStateMatcher } from '../../core/custom-validators.service';

@Component({
	selector: 'app-transactions-filter',
	templateUrl: './transactions-filter.component.html',
	styleUrls: [
		'./transactions-filter.component.css'
	]
})
export class TransactionsFilterComponent implements OnInit {
	categoryTypes: string[];
	categories: Categories;
	values: FilterValues;
	objectKeys = Object.keys;
	form: FormGroup;
	today: Date;
	compareControlsStateMatcher = new CompareControlsStateMatcher();

	constructor(
		private localStorageService: LocalStorageService,
		private customValidatorsService: CustomValidatorsService,
		private transactionFilterValuesService: TransactionFilterValuesService,
		private dialogRef: MatDialogRef<TransactionsFilterComponent>,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {
		this.categories = this.localStorageService.get('categories');
		this.categoryTypes = this.getCategoryTypes();
		this.values = this.transactionFilterValuesService.getValuesFromFilters(this.data.filters);
		this.today = startOfToday();
		this.form = this.getForm();

		/*
		 * When category type changes, check if the category is in the category type.
		 * If not reset category to an empty string
		 */
		this.form.controls['categoryType'].valueChanges.subscribe(value => {
			const topLevelMatch = find(this.categories[value], {name: this.values.category.eq}),
				childLevelMatch = find(this.categories[value], {children: [topLevelMatch]});

			if (value && !topLevelMatch && !childLevelMatch) {
				this.values.category.eq = '';
			}
		});
	}

	submit(): void {
		this.dialogRef.close(this.transactionFilterValuesService.getFiltersFromValues(this.values));
	}

	private getForm(): FormGroup {
		return this.formBuilder.group({
			dateGroup: this.formBuilder.group({
				dateGte: this.formBuilder.control('', [
					this.customValidatorsService.maxDate(this.today)
				]),
				dateLte: this.formBuilder.control('', [
					this.customValidatorsService.maxDate(this.today)
				])
			}, {
				validator: this.customValidatorsService.compareControls('dateLte', 'dateGte', '<')
			}),

			description: this.formBuilder.control('', []),
			categoryType: this.formBuilder.control('', []),
			category: this.formBuilder.control('', []),

			amountGroup: this.formBuilder.group({
				amountGte: this.formBuilder.control('', [
					Validators.min(0)
				]),
				amountLte: this.formBuilder.control('', [
					Validators.min(0)
				]),
			}, {
				validator: this.customValidatorsService.compareControls('amountLte', 'amountGte', '<')
			})
		});
	}

	private getCategoryTypes(): string[] {
		const categoryTypes = Object.keys(this.categories);

		categoryTypes.unshift('all');
		categoryTypes.splice(categoryTypes.indexOf('ignore'), 1);

		return categoryTypes;
	}
}
