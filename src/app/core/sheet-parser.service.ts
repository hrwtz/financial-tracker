import { Injectable } from '@angular/core';

import { Transaction } from './transaction';
import { Category, Categories } from './category';
import { ManualData } from './manual-data';

@Injectable()
export class SheetParserService {
	/*
	 * Parses the transactions sheet
	 *
	 * @return `Transaction[]` variable of the parsed data
	 */
	parseTransactions(data: string[][]): Transaction[] {
		const headers = data[0],
			transactions: Transaction[] = [];

		for (let i = 1; i < data.length; i++) {
			const row = data[i],
				transaction = {} as Transaction;

			row.forEach((cell, k) => {
				transaction[this.toCamelCase(headers[k])] = cell;
			});
			transaction.amount = Number(transaction.amount);
			if (transaction.transactionType === 'debit') {
				transaction.amount *= -1;
			}
			transaction.date = new Date(transaction.date);
			transactions.push(transaction);
		}

		return transactions;
	}

	/*
	 * Parses the categories sheet
	 *
	 * @return `Categories[]` variable of the parsed data
	 */
	parseCategories(data: string[][]): Categories {
		const headers = data[0],
			categories: Categories = {};

		headers.forEach(categoryName => {
			categories[this.toCamelCase(categoryName)] = [];
		});

		for (let i = 1; i < data.length; i++) {
			const row = data[i],
				previousRow = i === 1 ? [] : data[i - 1];

			headers.forEach((header, k) => {
				const currentCategory = row[k],
					previousCategory = previousRow[k],
					category = {} as Category,
					categoryList = categories[this.toCamelCase(header)];

				category.name = currentCategory;

				if (!previousCategory && currentCategory) {
					category.children = [];
					categoryList.push(category);
				} else if (currentCategory) {
					categoryList[categoryList.length - 1].children.push(category)
				}
			});
		}

		return categories;
	}

	/*
	 * Parses the manual data sheet
	 *
	 * @return `ManualData[]` variable of the parsed data
	 */
	parseManualData(data: string[][]): ManualData {
		const dates: string[] = data[0].slice(1),
			manualData = {} as ManualData;
		let currentSection: string,
			currentSectionCamelCase: string,
			previousRow: string[] = [];

		data.forEach((row, i) => {
			if (row.length && !previousRow.length) {
				/*
				 * If there was no previous row, this is a new section so add a new key
				 * with an empty object to the manualData object.
				 */
				currentSection = row[0];
				currentSectionCamelCase = this.toCamelCase(currentSection);
				manualData[currentSectionCamelCase] = {};
			} else if (row.length && row[0] !== currentSection) {
				/*
				 * Otherwise this is child row of a section. Add an empty array for the
				 * title  of this row.
				 */
				manualData[currentSectionCamelCase][this.toCamelCase(row[0])] = [];
				// For each cell with dollar values
				row.slice(1).forEach((cell, k) => {
					const parsedNumber = Number(cell.replace(/[^-0-9\.]+/g,"")),
						parsedDate = new Date(dates[k]);

					manualData[currentSectionCamelCase][this.toCamelCase(row[0])].push({
						date: parsedDate,
						value: parsedNumber
					});
					if (!manualData[currentSectionCamelCase].all) {
						manualData[currentSectionCamelCase].all = [];
					}
					if (!manualData[currentSectionCamelCase].all[k]) {
						manualData[currentSectionCamelCase].all[k] = {
							date: parsedDate,
							value: 0
						}
					}
					manualData[currentSectionCamelCase].all[k].value += parsedNumber;
				});
			}
			previousRow = row;
		});

		return manualData;
	}

	/*
	 * Takes in a string formatted as Title Case and formats it as camelCase
	 *
	 * @return `string` formatted in camelCase
	 */
	private toCamelCase(str: string): string {
		str = str || '';

		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
			index == 0 ? letter.toLowerCase() : letter.toUpperCase()
		).replace(/\s+/g, '');
	}
}
