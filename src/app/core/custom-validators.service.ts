import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import * as isDate from 'date-fns/is_date';

@Injectable()
export class CustomValidatorsService {
	/*
	 * Returns a validator function that will check if the value is
	 * before the minDate passed in.
	 */
	minDate(minDate: Date): ValidatorFn {
		return (control: FormControl): {[key: string]: any} => {
			if (!isDate(control.value) || !isDate(minDate)) {
				return null;
			}
			return control.value < minDate ? {
				minDate: {
					minDate: minDate,
					actual: control.value
				}
			} : null;
		};
	}

	/*
	 * Returns a validator function that will check if the value is
	 * after the maxDate passed in.
	 */
	maxDate(maxDate: Date): ValidatorFn {
		return (control: FormControl): {[key: string]: any} => {
			if (!isDate(control.value) || !isDate(maxDate)) {
				return null;
			}
			return control.value > maxDate ? {
				maxDate: {
					maxDate: maxDate,
					actual: control.value
				}
			} : null;
		};
	}

	/*
	 * Returns a validator function that will compare two controls
	 * inside a group given the control names and the operator used
	 * to compare them.
	 */
	compareControls(control1: string, control2, operator: string): ValidatorFn {
		if (['<', '>'].indexOf(operator) === -1) {
			throw new Error('Operator is not valid.');
		}

		return (control: FormGroup): {[key: string]: any} => {
			const value1 = control.value[control1],
				value2 = control.value[control2];

			return (value1 && value2 && this.compareValues(operator, value1, value2)) ? {
				compareControls: {
					value1: value1,
					value2: value2,
					operator: operator
				}
			} : null;
		};
	}

	private compareValues(operator: string, a: Date|number, b: Date|number): boolean {
		if (operator === '>') {
			return a > b;
		} else if (operator === '<') {
			return a < b;
		}
	}
}

/*
 * Matcher class used on fields that have the compareControls validator
 * attached to it. If the parent group has the compareControls error on
 * it, we know the current field is invalid.
 */
export class CompareControlsStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!((control && control.invalid) || (control.parent.errors && control.parent.errors.compareControls));
	}
}
