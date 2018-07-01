export interface Category {
	name: string;
	children?: Category[];
}

export interface Categories {
	[key: string]: Category[];
}
