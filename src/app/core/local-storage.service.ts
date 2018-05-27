import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
	/*
	 * Gets data from local storage and parses it into a json object. If the data contains
	 * dates, it parses the dates.
	 *
	 * @return `any` variable of the parsed data
	 */
	get(item: string): any {
		const rawData: string = localStorage.getItem(item);
		let dataObject: any;

		try {
			dataObject = JSON.parse(rawData);
		} catch (error) {
			dataObject = rawData;
		}
		return this.convertDateStringsToDates(dataObject);
	}

	/*
	 * Sets the data passed in to local storage.
	 */
	set(item: string, value: any): void {
		localStorage.setItem(item, JSON.stringify(value));
	}

	/*
	 * Recursively parses the variable passed in and converts all date strings to date.
	 *
	 * @return `any` variable of the parsed data
	 */
	private convertDateStringsToDates(input: any): any {
		const parsedValue: any = this.updateStringToDate(input);

		if (parsedValue instanceof Date) {
			return parsedValue;
		} if (typeof input !== 'object') {
			return input;
		}

		for (const key in input) {
			if (!input.hasOwnProperty(key)) {
				continue;
			} else if (this.updateStringToDate(input[key])) {
				input[key] = this.updateStringToDate(input[key]);
			} else if (typeof input[key] === 'object') {
				this.convertDateStringsToDates(input[key]);
			}
		}
		return input;
	}

	/*
	 * Checks if the value passed in is a date formatted string. If it is, it converts it
	 * to a date. Else, it returns the original value.
	 *
	 * @return `any` variable of the parsed data
	 */
	private updateStringToDate(value: any): any {
		if (typeof value === 'string') {
			const regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/,
				match = value.match(regexIso8601);

			if (match) {
				const milliseconds = Date.parse(match[0]);

				if (!isNaN(milliseconds)) {
					return new Date(milliseconds);
				}
			}
		}
		return value;
	}
}
