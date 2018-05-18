import { Observable } from 'rxjs/Observable';

export interface Sheet {
	name: string;
	id: string;
	parser?: (any) => any;
}

export interface SheetResponse {
	[key: string]: any,
	values: string[][]
}

export interface SheetPromises {
	string?: Observable<any>
}
