export interface ManualData {
	[key: string]: {
		[key: string]: {
			date: Date,
			value: number
		}[]
	};
}
