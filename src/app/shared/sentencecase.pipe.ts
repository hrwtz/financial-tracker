import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sentencecase'})
export class SentenceCasePipe implements PipeTransform {
	/*
	 * Takes in a pascal/camel case string and turns it into sentence case
	 * where each word has a space before it.
	 */
	transform(value: string): string {
		for (let i = value.length - 1; i >= 0; i--) {
			if (value[i] === value[i].toUpperCase()) {
				value = value.slice(0, i) + ' ' + value.slice(i);
			}
		}

		return value;
	}
}
