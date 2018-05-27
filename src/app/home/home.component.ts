import { Component, OnInit, OnDestroy } from '@angular/core';
import { Options as HighchartsOptions, ChartObject } from 'highcharts';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

import { SheetFetcherService } from '../core/sheet-fetcher.service';
import { BaseIncomechartService } from './shared/base-income-chart.service';
import { NetWorthChartService } from './shared/net-worth-chart.service';
import { NetWorthByTypeChartService } from './shared/net-worth-by-type-chart.service';
import { NetWorthWithInvestmentsChartService } from './shared/net-worth-with-investments-chart.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [
		'./home.component.css'
	]
})
export class HomeComponent implements OnInit, OnDestroy {
	private isAlive = true;
	private chartObjects: ChartObject[] = [];
	chartOptions: HighchartsOptions[];

	constructor(
		private sheetFetcherService: SheetFetcherService,
		private baseIncomechartService: BaseIncomechartService,
		private netWorthChartService: NetWorthChartService,
		private netWorthByTypeChartService: NetWorthByTypeChartService,
		private netWorthWithInvestmentsChartService: NetWorthWithInvestmentsChartService
	) {}

	/*
	 * When data is ready (not in progress and component is alive), set the
	 * updated chart options and update the chart objects.
	 */
	ngOnInit() {
		this.sheetFetcherService.getObservables()
			.filter(isCompleted => isCompleted)
			.takeWhile(isCompleted => this.isAlive)
			.subscribe((isCompleted) => {
				this.chartOptions = [
					this.netWorthChartService.getOptions(),
					this.netWorthByTypeChartService.getOptions(),
					this.netWorthWithInvestmentsChartService.getOptions(),
					this.baseIncomechartService.getOptions()
				];

				this.chartObjects.forEach((chartObject, index) => {
					chartObject.update(this.chartOptions[index]);
				});
			});
	}

	/*
	 * Set isAlive to false so we can stop watching observers after the component
	 * is destroyed
	 */
	ngOnDestroy() {
		this.isAlive = false;
	}

	/*
	 * Store the chart objects for later use
	 */
	saveInstance(chartObject: ChartObject, index: number) {
		this.chartObjects.splice(index, 0, chartObject);
	}
}
