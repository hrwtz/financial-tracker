import { Injectable } from '@angular/core';
import { Options as HighchartsOptions, ColumnChartSeriesOptions } from 'highcharts';

import { LocalStorageService } from '../../core/local-storage.service';
import { ChartOptionsService } from '../shared/chart-options.service';

@Injectable()
export class NetWorthChartService {
	constructor(
		private localStorageService: LocalStorageService,
		private chartOptionsService: ChartOptionsService
	) {}

	private getSeries(): ColumnChartSeriesOptions {
		const manualData = this.localStorageService.get('manual-data'),
			netWorthData = manualData.netWorth.all.reverse();

		return {
			data: netWorthData.map(row => row.value),
			pointStart: new Date(netWorthData[0].date).getTime()
		};
	}

	getOptions(): HighchartsOptions {
		return this.chartOptionsService.getBaseOptions({
			chart: {
				type: 'column'
			},

			title: {
				text: 'Net Worth'
			},

			yAxis: {
				title: {
					text: 'Net Worth'
				}
			},

			series: [Object.assign({
				name: 'Net Worth'
			}, this.getSeries())]
		});
	}
}
