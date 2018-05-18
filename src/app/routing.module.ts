import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeModule } from './home/home.module';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: '**',
		redirectTo: '',
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes),
		HomeModule
	],
	declarations: []
})
export class RoutingModule { }
