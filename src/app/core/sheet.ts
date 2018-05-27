import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface Sheet {
	name: string;
	id: string;
	parser?: (any) => any;
}

export interface SheetResponse {
	[key: string]: any;
	values: string[][];
}

export interface SheetSubjects {
	string?: ReplaySubject<boolean>;
}
