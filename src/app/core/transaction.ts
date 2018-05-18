export interface Transaction {
	date: Date;
	description: string;
	originalDescription: string;
	amount: number;
	transactionType: 'credit' | 'debit';
	category: string;
	accountName: string;
	labels: string;
	notes: string;
}
