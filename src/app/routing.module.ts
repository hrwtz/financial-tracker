import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeModule } from './home/home.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HomeComponent } from './home/home.component';
import { TransactionsComponent } from './transactions/transactions.component';

const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'transactions',
		component: TransactionsComponent,
	},
	{
		path: '**',
		redirectTo: '',
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes),
		HomeModule,
		TransactionsModule
	],
	declarations: []
})
export class RoutingModule { }
