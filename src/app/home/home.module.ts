import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular2-highcharts';
import * as Highcharts from 'highcharts';

import { HomeComponent } from './home.component';
import { ChartOptionsService } from './shared/chart-options.service';
import { BaseIncomechartService } from './shared/base-income-chart.service';
import { NetWorthChartService } from './shared/net-worth-chart.service';
import { NetWorthByTypeChartService } from './shared/net-worth-by-type-chart.service';
import { NetWorthWithInvestmentsChartService } from './shared/net-worth-with-investments-chart.service';

@NgModule({
	imports: [
		CommonModule,
		ChartModule.forRoot(Highcharts)
	],
	providers: [
		ChartOptionsService,
		BaseIncomechartService,
		NetWorthChartService,
		NetWorthByTypeChartService,
		NetWorthWithInvestmentsChartService
	],
	declarations: [
		HomeComponent,
	],
	exports: [
		HomeComponent
	]
})
export class HomeModule { }
